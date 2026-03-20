import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import FirecrawlApp from '@mendable/firecrawl-js'

export async function POST(request: NextRequest) {
  // 1. Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in again.' }, { status: 401 })
  }

  // 2. Validate input
  let params: any
  try {
    const body = await request.json()
    params = body
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { role, skills, location, workMode, experience, jobType } = params;

  if (!role || !role.trim()) {
    return NextResponse.json({ error: 'Target role is required' }, { status: 400 })
  }

  // 3. Check API key
  if (!process.env.FIRECRAWL_API_KEY) {
    console.error('FIRECRAWL_API_KEY is not configured')
    return NextResponse.json({ error: 'Job search service is not configured. Please add FIRECRAWL_API_KEY.' }, { status: 500 })
  }

  if (!process.env.OPENROUTER_API_KEY) {
    console.error('OPENROUTER_API_KEY is not configured')
    return NextResponse.json({ error: 'AI service is not configured. Please add OPENROUTER_API_KEY.' }, { status: 500 })
  }

  const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY })

  try {
    // 4. Construct search query
    const searchTerms = [
      role,
      skills ? skills.replace(/,/g, ' ') : '', // remove commas to make it a broader phrase
      location,
      workMode !== 'Any' ? workMode : '',
      experience !== 'Any' ? experience : '',
      jobType !== 'Any' ? jobType : '',
      'jobs openings'
    ].filter(Boolean).join(' ')

    console.log('Searching for jobs with query:', searchTerms)
    
    let searchResponse: any
    try {
      searchResponse = await firecrawl.search(
        searchTerms, 
        {
          limit: 10,
          scrapeOptions: {
            formats: ['markdown']
          }
        }
      )
    } catch (firecrawlError: any) {
      console.error('Firecrawl API Error:', firecrawlError.message)
      return NextResponse.json(
        { error: `Job search failed: ${firecrawlError.message || 'Firecrawl service unavailable'}` },
        { status: 502 }
      )
    }

    if (!searchResponse) {
      console.error('Firecrawl returned null response')
      return NextResponse.json(
        { error: 'Job search returned no results. Please try adjusting your filters.' },
        { status: 404 }
      )
    }

    const searchResults = Array.isArray(searchResponse.data) ? searchResponse.data : 
                          Array.isArray(searchResponse.web) ? searchResponse.web : 
                          Array.isArray(searchResponse) ? searchResponse : [];

    if (searchResults.length === 0) {
      console.error('Firecrawl returned empty results:', searchResponse)
      return NextResponse.json(
        { error: 'Job search returned no results. Please try broadening your skills or location.' },
        { status: 404 }
      )
    }

    // 5. Prepare data for AI parsing
    const rawData = searchResults.map((d: any) => ({
      title: d.title || 'Untitled',
      description: d.description || '',
      url: d.url || d.link || '',
      content: d.markdown?.substring(0, 1000) || d.description?.substring(0, 1000) || ''
    }))

    console.log(`Firecrawl returned ${rawData.length} results, sending to AI for parsing...`)

    // 6. Send to OpenRouter for structured parsing with strict instructions based on parameters
    let parseResponse: Response
    try {
      parseResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            {
              role: 'system',
              content: `You are an expert AI technical recruiter. I will provide you with raw search results for job openings. Your task is to extract a list of 5-8 highly relevant job listings that match the following criteria criteria:
              Role: ${role}
              Skills: ${skills || 'Any'}
              Location: ${location || 'Any'}
              Work Mode: ${workMode}
              Experience: ${experience}
              Job Type: ${jobType}

              For each valid job, extract and normalize: "title", "company", "location", "link", and a short "description" (1-2 sentences explaining why the role is a good fit).
              Format your entire response strictly as a JSON array of objects.
              Respond ONLY with the JSON array, no markdown formatting. Do not include jobs that blatantly violate the criteria.`
            },
            {
              role: 'user',
              content: `Raw Search Data: ${JSON.stringify(rawData)}`
            }
          ]
        })
      })
    } catch (fetchError: any) {
      console.error('OpenRouter fetch error:', fetchError.message)
      return NextResponse.json(
        { error: 'AI parsing service is unavailable. Please try again later.' },
        { status: 502 }
      )
    }

    if (!parseResponse.ok) {
      const errorBody = await parseResponse.text()
      console.error('OpenRouter API error:', parseResponse.status, errorBody)
      return NextResponse.json(
        { error: `AI service error (${parseResponse.status}). Please try again.` },
        { status: 502 }
      )
    }

    // 7. Parse AI response safely
    let parseData: any
    try {
      parseData = await parseResponse.json()
    } catch {
      console.error('Failed to parse OpenRouter JSON response')
      return NextResponse.json(
        { error: 'AI returned invalid response. Please try again.' },
        { status: 500 }
      )
    }

    if (!parseData?.choices?.[0]?.message?.content) {
      console.error('OpenRouter returned empty or malformed response:', parseData)
      return NextResponse.json(
        { error: 'AI returned empty response. Please try again.' },
        { status: 500 }
      )
    }

    let rawContent = parseData.choices[0].message.content
    // Clean up markdown code blocks if present
    rawContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim()
    
    let content: any
    try {
      content = JSON.parse(rawContent)
    } catch (parseError) {
      console.error('Failed to parse AI output as JSON:', rawContent.substring(0, 200))
      // Try to extract JSON array from the content
      const arrayMatch = rawContent.match(/\[[\s\S]*\]/)
      if (arrayMatch) {
        try {
          content = JSON.parse(arrayMatch[0])
        } catch {
          return NextResponse.json(
            { error: 'Failed to parse job results. Please try again.' },
            { status: 500 }
          )
        }
      } else {
        return NextResponse.json(
          { error: 'Failed to parse job results. Please try again.' },
          { status: 500 }
        )
      }
    }
    
    // Handle both { jobs: [...] } and [...] formats
    const jobs = Array.isArray(content) ? content : (content.jobs || content.listings || [])

    // Validate each job object has required fields
    const validJobs = jobs.filter((job: any) => job && (job.title || job.company)).map((job: any) => ({
      title: job.title || 'Unknown Position',
      company: job.company || 'Unknown Company',
      location: job.location || 'Not specified',
      link: job.link || job.url || '#',
      description: job.description || 'No detailed description available.',
    }))

    console.log(`Successfully parsed ${validJobs.length} jobs`)
    return NextResponse.json({ jobs: validJobs })

  } catch (error: any) {
    console.error('Job Search Unexpected Error:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
