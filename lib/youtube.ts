const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

if (!YOUTUBE_API_KEY) {
  console.warn("YOUTUBE_API_KEY is not set in environment variables. YouTube video integration will not work.")
}

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  channelTitle: string
  duration: string
  viewCount: string
  publishedAt: string
  url: string
}

export async function searchYouTubeVideos(query: string, maxResults = 5): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API key not configured. Returning empty results.")
    return []
  }

  const baseUrl = "https://www.googleapis.com/youtube/v3"

  try {
    // Search for videos
    const searchUrl = `${baseUrl}/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}&order=relevance&videoDuration=medium`

    const searchResponse = await fetch(searchUrl)
    if (!searchResponse.ok) {
      throw new Error(`YouTube API search error: ${searchResponse.status}`)
    }

    const searchData = await searchResponse.json()

    if (!searchData.items || searchData.items.length === 0) {
      return []
    }

    // Get video details including duration and statistics
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",")
    const detailsUrl = `${baseUrl}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`

    const detailsResponse = await fetch(detailsUrl)
    if (!detailsResponse.ok) {
      throw new Error(`YouTube API details error: ${detailsResponse.status}`)
    }

    const detailsData = await detailsResponse.json()

    // Combine search results with video details
    const videos: YouTubeVideo[] = searchData.items.map((item: any, index: number) => {
      const details = detailsData.items[index]

      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
        channelTitle: item.snippet.channelTitle,
        duration: formatDuration(details?.contentDetails?.duration || "PT0M"),
        viewCount: formatViewCount(details?.statistics?.viewCount || "0"),
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }
    })

    return videos
  } catch (error) {
    console.error("Error searching YouTube videos:", error)
    return []
  }
}


export async function findVideosForChapter(
  chapterTitle: string,
  topics: string[],
  category: string,
): Promise<YouTubeVideo[]> {
  // Generate more specific and varied search queries
  const queries: string[] = [
    `${chapterTitle} ${category} tutorial`,
    `${chapterTitle} for beginners`,
  ]

  // Add queries for each topic to get more targeted results
  if (topics && topics.length > 0) {
    topics.slice(0, 2).forEach((topic) => {
      queries.push(`${topic} in ${chapterTitle} explained`)
      queries.push(`${topic} ${category} tutorial`)
    })
  }

  const allVideos: YouTubeVideo[] = []
  const videoIds = new Set<string>()

  // Fetch 2 videos for each query to build a diverse pool
  for (const query of queries) {
    const videos = await searchYouTubeVideos(query, 2)
    videos.forEach((video) => {
      if (!videoIds.has(video.id)) {
        allVideos.push(video)
        videoIds.add(video.id)
      }
    })
  }

  // Return the top 3 unique videos
  return allVideos.slice(0, 3)
}

function formatDuration(duration: string): string {
  // Convert ISO 8601 duration (PT4M13S) to readable format (4:13)
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return "0:00"

  const hours = Number.parseInt(match[1] || "0")
  const minutes = Number.parseInt(match[2] || "0")
  const seconds = Number.parseInt(match[3] || "0")

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function formatViewCount(viewCount: string): string {
  const count = Number.parseInt(viewCount)
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`
  }
  return `${count} views`
}


