import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createChallenge, getCategories } from '@/utils/contractInteraction'

export default function CreateChallenge() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stake, setStake] = useState('')
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')

  useEffect(() => {
    async function fetchCategories() {
      const fetchedCategories = await getCategories()
      setCategories(fetchedCategories)
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createChallenge(title, category, stake, 30, 24) // Assuming 30 days duration and 24 hours grace period
      // Redirect to dashboard or show success message
      console.log('Challenge created successfully!')
    } catch (error) {
      console.error("Error creating challenge:", error)
      // Show error message to user
      alert('Error creating challenge. Please check the console for details.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Challenge</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <Label htmlFor="title">Challenge Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            id="category"
            value={category}
            onValueChange={(value) => setCategory(value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat, index) => (
                <SelectItem key={index} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="stake">Stake Amount (ETH)</Label>
          <Input
            id="stake"
            type="number"
            step="0.01"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Create Challenge</Button>
      </form>
    </div>
  )
}

