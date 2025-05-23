"use client"
import { useEffect, useState } from "react"
import { getCurrentUser, updateUserProfile, getUserBlogs } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ username: "", email: "", avatar: "" })
  const [saving, setSaving] = useState(false)
  const [blogs, setBlogs] = useState<any[]>([])
  // TODO: Add books, snippets, etc.

  useEffect(() => {
    async function fetchData() {
      const userData = await getCurrentUser()
      setUser(userData.user)
      setForm({
        username: userData.user.username || "",
        email: userData.user.email || "",
        avatar: userData.user.avatar || ""
      })
      // Fetch user blogs from backend
      const blogRes = await getUserBlogs(userData.user._id)
      setBlogs(blogRes.blogs || blogRes.data || [])
      // TODO: Fetch books, snippets, etc.
    }
    fetchData()
  }, [])

  async function handleSave() {
    setSaving(true)
    await updateUserProfile(form)
    setEdit(false)
    setSaving(false)
    // Optionally refetch user
    const userData = await getCurrentUser()
    setUser(userData.user)
  }

  if (!user) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || "/placeholder-user.jpg"}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div>
              {edit ? (
                <Input
                  value={form.avatar}
                  onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))}
                  placeholder="Avatar URL"
                />
              ) : (
                <div className="text-muted-foreground text-xs">Avatar URL: {user.avatar || "-"}</div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Username</label>
            {edit ? (
              <Input
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              />
            ) : (
              <div className="text-lg font-semibold">{user.username}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            {edit ? (
              <Input
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            ) : (
              <div>{user.email}</div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            {edit ? (
              <>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setEdit(false)} disabled={saving}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEdit(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Blogs</CardTitle>
        </CardHeader>
        <CardContent>
          {blogs.length === 0 ? (
            <div className="text-muted-foreground">No blogs yet.</div>
          ) : (
            <div className="space-y-2">
              {blogs.map(blog => (
                <div key={blog._id} className="p-2 border rounded flex flex-col gap-1">
                  <div className="font-semibold">{blog.title}</div>
                  <div className="text-xs text-muted-foreground">{blog.description}</div>
                  <div className="flex gap-1 flex-wrap">
                    {blog.tags?.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">No books yet.</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your Snippets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">No snippets yet.</div>
        </CardContent>
      </Card>
    </div>
  )
}
