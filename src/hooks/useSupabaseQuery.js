import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * Fetches all rows from any public Supabase table.
 * Returns { data, loading, error, refetch }
 */
export function useSupabaseQuery(table, options = {}) {
  const { orderBy = null, ascending = true } = options
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    if (!supabase) { setError('Supabase no configurado'); setLoading(false); return }
    try {
      let query = supabase.from(table).select('*')
      if (orderBy) query = query.order(orderBy, { ascending })
      const { data: rows, error: err } = await query
      if (err) throw err
      setData(rows)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [table])

  return { data, loading, error, refetch: fetchData }
}

/**
 * Fetches site_content as a plain key→value map.
 * Returns { content: { hero_title: '...', ... }, loading, error, refetch }
 */
export function useSiteContent() {
  const { data, loading, error, refetch } = useSupabaseQuery('site_content')

  const content = data
    ? Object.fromEntries(data.map(({ key, value }) => [key, value]))
    : {}

  return { content, loading, error, refetch }
}
