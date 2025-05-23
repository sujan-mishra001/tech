"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Code, Database, FileType2, BookOpen, FolderKanban, Upload, X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { uploadContent } from "@/lib/mongodb"

export default function UploadPage() {
  const router = useRouter()
  const [contentType, setContentType] = useState("blog")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleTagAdd()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // In a real app, this would upload to MongoDB Data API
      await uploadContent({
        type: contentType,
        title,
        description,
        content,
        file,
        url,
        tags,
      })

      toast({
        title: "Success",
        description: "Content uploaded successfully",
      })

      router.push("/")
    } catch (error) {
      console.error("Error uploading content:", error)
      toast({
        title: "Error",
        description: "Failed to upload content",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contentTypeIcons = {
    blog: <FileText className="h-5 w-5" />,
    snippet: <Code className="h-5 w-5" />,
    dataset: <Database className="h-5 w-5" />,
    file: <FileType2 className="h-5 w-5" />,
    book: <BookOpen className="h-5 w-5" />,
    project: <FolderKanban className="h-5 w-5" />,
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Upload Content</h1>
        <p className="text-muted-foreground">Add new content to your Data Science Knowledge Hub</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Details</CardTitle>
          <CardDescription>Fill in the details for the content you want to upload</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <Tabs defaultValue="blog" onValueChange={setContentType}>
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                  <TabsTrigger value="blog" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden md:inline">Blog</span>
                  </TabsTrigger>
                  <TabsTrigger value="snippet" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span className="hidden md:inline">Snippet</span>
                  </TabsTrigger>
                  <TabsTrigger value="dataset" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span className="hidden md:inline">Dataset</span>
                  </TabsTrigger>
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <FileType2 className="h-4 w-4" />
                    <span className="hidden md:inline">File</span>
                  </TabsTrigger>
                  <TabsTrigger value="book" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden md:inline">Book</span>
                  </TabsTrigger>
                  <TabsTrigger value="project" className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4" />
                    <span className="hidden md:inline">Project</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter a brief description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <TabsContent value="blog" className="space-y-4 mt-0">
                    <div className="grid gap-2">
                      <Label htmlFor="blog-content">Blog Content (Markdown)</Label>
                      <Textarea
                        id="blog-content"
                        placeholder="Write your blog post in Markdown format"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={10}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="snippet" className="space-y-4 mt-0">
                    <div className="grid gap-2">
                      <Label htmlFor="snippet-content">Code Snippet</Label>
                      <Textarea
                        id="snippet-content"
                        placeholder="Paste your code snippet here"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={10}
                        className="font-mono"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="dataset" className="space-y-4 mt-0">
                    <div className="grid gap-2">
                      <Label htmlFor="dataset-file">Dataset File</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="dataset-file"
                          type="file"
                          accept=".csv,.xlsx,.json"
                          onChange={handleFileChange}
                          className="flex-1"
                        />
                        {file && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove file</span>
                          </Button>
                        )}
                      </div>
                      {file && (
                        <p className="text-xs text-muted-foreground">
                          Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="file" className="space-y-4 mt-0">
                    <div className="grid gap-2">
                      <Label htmlFor="file-upload">File Upload</Label>
                      <div className="flex items-center gap-2">
                        <Input id="file-upload" type="file" onChange={handleFileChange} className="flex-1" />
                        {file && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove file</span>
                          </Button>
                        )}
                      </div>
                      {file && (
                        <p className="text-xs text-muted-foreground">
                          Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="book" className="space-y-4 mt-0">
                    <div className="grid gap-2">
                      <Label htmlFor="book-url">Book URL</Label>
                      <Input
                        id="book-url"
                        type="url"
                        placeholder="Enter book URL or link"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="book-notes">Notes</Label>
                      <Textarea
                        id="book-notes"
                        placeholder="Add your notes about this book"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="project" className="space-y-4 mt-0">
                    <div className="grid gap-2">
                      <Label htmlFor="project-url">Project URL (GitHub)</Label>
                      <Input
                        id="project-url"
                        type="url"
                        placeholder="Enter GitHub repository URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="project-description">Project Description</Label>
                      <Textarea
                        id="project-description"
                        placeholder="Describe your project"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                      />
                    </div>
                  </TabsContent>

                  <div className="grid gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="tags"
                        placeholder="Add tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                      />
                      <Button type="button" variant="outline" size="icon" onClick={handleTagAdd}>
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add tag</span>
                      </Button>
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleTagRemove(tag)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {tag}</span>
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Tabs>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload Content
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
