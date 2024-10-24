'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Step = 'event-details' | 'location' | 'interpreter-matches'

export function GetStartedForm() {
  const [step, setStep] = useState<Step>('event-details')
  const [formData, setFormData] = useState({
    eventType: '',
    date: new Date(),
    duration: '',
    location: '',
  })

  const renderStep = () => {
    switch (step) {
      case 'event-details':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, eventType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Medical Appointment</SelectItem>
                  <SelectItem value="legal">Legal Meeting</SelectItem>
                  <SelectItem value="education">Educational Event</SelectItem>
                  <SelectItem value="business">Business Meeting</SelectItem>
                  <SelectItem value="personal">Personal Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Event Date</Label>
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => date && setFormData({ ...formData, date })}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="8"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>

            <Button
              onClick={() => setStep('location')}
              disabled={!formData.eventType || !formData.duration}
              className="w-full"
            >
              Next: Location
            </Button>
          </div>
        )

      case 'location':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">Event Location</Label>
              <Input
                id="location"
                placeholder="Enter address or allow location access"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <Button
              onClick={() => setStep('interpreter-matches')}
              disabled={!formData.location}
              className="w-full"
            >
              Find Interpreters
            </Button>

            <Button
              variant="outline"
              onClick={() => setStep('event-details')}
              className="w-full"
            >
              Back
            </Button>
          </div>
        )

      case 'interpreter-matches':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Available Interpreters</h3>
            {/* This will be populated with actual interpreter data */}
            <div className="space-y-4">
              <Card className="p-4">
                <p className="font-medium">Loading interpreters...</p>
                <p className="text-sm text-gray-500">
                  Matching based on your requirements...
                </p>
              </Card>
            </div>

            <Button
              variant="outline"
              onClick={() => setStep('location')}
              className="w-full"
            >
              Back
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Schedule an Interpreter</h2>
      <Card className="p-6">{renderStep()}</Card>
    </div>
  )
}
