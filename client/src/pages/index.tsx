import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { initializeContract, getChallengeDetails, getCategories } from '../utils/contractInteraction'
import { ethers } from 'ethers'

export default function Dashboard() {
  const [challenges, setChallenges] = useState([])

  useEffect(() => {
    async function fetchChallenges() {
      await initializeContract()
      const categories = await getCategories()
      const fetchedChallenges = await Promise.all(
        categories.map(async (_, index) => {
          const challenge = await getChallengeDetails(index)
          return {
            id: index,
            title: challenge.title,
            participants: challenge.participantCount.toNumber(),
            stake: ethers.formatEther(challenge.stakingAmount),
          }
        })
      )
      setChallenges(fetchedChallenges)
    }
    fetchChallenges()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Active Challenges</h1>
        <Link href="/create-challenge">
          <Button>Create New Challenge</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <Card key={challenge.id}>
            <CardHeader>
              <CardTitle>{challenge.title}</CardTitle>
              <CardDescription>{challenge.participants} participants</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Stake: {challenge.stake} ETH</p>
            </CardContent>
            <CardFooter>
              <Link href={`/challenge/${challenge.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

