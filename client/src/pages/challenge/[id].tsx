import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { ethers } from 'ethers'
import { getChallengeDetails, uploadDailyPost, withdrawUnclaimedRewards } from '@/utils/contractInteraction'

export default function ChallengeDetails() {
  const router = useRouter()
  const { id } = router.query
  const [imageUrl, setImageUrl] = useState('')
  const [challenge, setChallenge] = useState(null)
  const [updates, setUpdates] = useState([])

  useEffect(() => {
    async function fetchChallengeDetails() {
      if (id) {
        const details = await getChallengeDetails(parseInt(id as string))
        setChallenge({
          title: details.title,
          creator: details.creator,
          stake: ethers.formatEther(details.stakingAmount),
          participants: details.participantCount.toNumber(),
        })
        // Fetch updates from IPFS or other storage solution
      }
    }
    fetchChallengeDetails()
  }, [id])

  const handleEnroll = () => {
    // Integrate with smart contract to enroll in the challenge
    console.log('Enrolling in challenge:', id)
  }

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await uploadDailyPost(parseInt(id as string), imageUrl)
      // Add the new update to the updates state
      setUpdates([...updates, { imageUrl, poster: 'Current User Address' }])
      setImageUrl('')
    } catch (error) {
      console.error("Error posting update:", error)
      // Show error message to user
    }
  }

  const handleWithdrawRewards = async () => {
    try {
      await withdrawUnclaimedRewards(parseInt(id as string))
      // Show success message to user
    } catch (error) {
      console.error("Error withdrawing rewards:", error)
      // Show error message to user
    }
  }

  if (!challenge) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{challenge.title}</CardTitle>
          <CardDescription>Created by {challenge.creator}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Stake: {challenge.stake} ETH</p>
          <p className="mb-4">Participants: {challenge.participants}</p>
          <p className="mb-4">Description: Post a picture of yourself at the gym every day to stay in the challenge.</p>
          <Button onClick={handleEnroll}>Enroll in Challenge</Button>
          <Button onClick={handleWithdrawRewards}>Withdraw Rewards</Button>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mt-8 mb-4">Post Daily Update</h2>
      <form onSubmit={handlePostUpdate} className="space-y-4">
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/your-gym-picture.jpg"
            required
          />
        </div>
        <Button type="submit">Post Update</Button>
      </form>

      <h2 className="text-2xl font-bold mt-8 mb-4">Recent Updates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {updates.map((update, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Image
                src={update.imageUrl}
                alt={`Update ${i}`}
                width={300}
                height={200}
                className="rounded-lg mb-2"
              />
              <p className="text-sm text-gray-500">Posted by {update.poster}</p>
              <div className="mt-2">
                <Button variant="outline" size="sm" className="mr-2">Verify</Button>
                <Button variant="outline" size="sm">Report</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

