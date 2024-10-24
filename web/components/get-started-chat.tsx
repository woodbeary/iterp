'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from '@/components/ui/calendar'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { getCurrentLocation, reverseGeocode, searchAddress } from '@/lib/location-service'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { MapPreview } from '@/components/map-preview'
import { findInterpreters } from '@/lib/db-service'
import type { Interpreter, PlatformInterpreter, BaseInterpreter } from '@/types/interpreter'
import { InterpreterResults } from '@/components/interpreter-results'

// Type definitions
type StepType = 'options' | 'calendar' | 'location'
type StepId = 'event-details' | 'calendar' | 'location' | 'duration' | 'time' | 'results'

interface BaseStep {
  id: StepId
  question: string
  type: StepType
}

interface OptionsStep extends BaseStep {
  type: 'options'
  options: Array<{
    icon: string
    label: string
    value: string
  }>
}

interface CalendarStep extends BaseStep {
  type: 'calendar'
}

interface LocationStep extends BaseStep {
  type: 'location'
}

type Step = OptionsStep | CalendarStep | LocationStep

// Steps configuration
const steps: Step[] = [
  {
    id: 'event-details',
    question: "👋 Hi! Let's find you an interpreter. What type of event is this for?",
    type: 'options',
    options: [
      { icon: '🏥', label: 'Medical Appointment', value: 'medical' },
      { icon: '⚖️', label: 'Legal Meeting', value: 'legal' },
      { icon: '🎓', label: 'Educational Event', value: 'education' },
      { icon: '💼', label: 'Business Meeting', value: 'business' },
      { icon: '👋', label: 'Personal Event', value: 'personal' },
    ],
  },
  {
    id: 'calendar',
    question: 'When do you need the interpreter?',
    type: 'calendar',
  },
  {
    id: 'time',
    question: 'What time works best?',
    type: 'options',
    options: [
      { icon: '🌅', label: 'Morning (8AM - 12PM)', value: 'morning' },
      { icon: '☀️', label: 'Afternoon (12PM - 5PM)', value: 'afternoon' },
      { icon: '🌆', label: 'Evening (5PM - 9PM)', value: 'evening' },
    ],
  },
  {
    id: 'duration',
    question: 'How long do you need the interpreter?',
    type: 'options',
    options: [
      { icon: '⏱️', label: '1 Hour', value: '1' },
      { icon: '⏲️', label: '2 Hours', value: '2' },
      { icon: '🕒', label: '3 Hours', value: '3' },
      { icon: '⏰', label: '4+ Hours', value: '4+' },
    ],
  },
  {
    id: 'location',
    question: 'Where will this take place?',
    type: 'location',
  }
] as const

export function GetStartedChat() {
  // Move all state declarations inside the component
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([])
  const [addressInput, setAddressInput] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
    address: string
  } | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [matchedInterpreters, setMatchedInterpreters] = useState<{
    platformInterpreters: PlatformInterpreter[]
    directoryInterpreters: BaseInterpreter[]
  }>({ platformInterpreters: [], directoryInterpreters: [] })
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)  // Add this new state

  const debouncedAddress = useDebounce(addressInput, 500)

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleSelect = (value: string, label?: string) => {
    setSelectedOption(value)
    setAnswers(prev => ({ ...prev, [step.id]: value }))
    // Remove the automatic progression
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setSelectedOption(null)
    } else {
      handleCompletion(answers)
    }
  }

  const handleCompletion = async (finalAnswers: Record<string, string>) => {
    setIsSearching(true)
    setHasSearched(true)  // Set this when search begins
    try {
      const locationData = JSON.parse(finalAnswers.location)
      const date = new Date(finalAnswers.date)

      const interpreters = await findInterpreters({
        eventType: finalAnswers['event-type'],
        date,
        time: finalAnswers.time,
        duration: finalAnswers.duration,
        location: locationData.coordinates
      })

      setMatchedInterpreters(interpreters)
      
      // Show results section
      setCurrentStep(steps.length - 1)
    } catch (error) {
      console.error('Error finding interpreters:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setSelectedOption(null)
    }
  }

  const handleCurrentLocation = async () => {
    setIsLoadingLocation(true)
    setLocationError(null)
    
    try {
      const position = await getCurrentLocation()
      const address = await reverseGeocode(position.lat, position.lng)
      
      if (address) {
        setSelectedLocation({
          lat: position.lat,
          lng: position.lng,
          address: address.place_name
        })
        handleSelect(JSON.stringify({
          address: address.place_name,
          coordinates: position
        }))
      }
    } catch (error) {
      setLocationError('Unable to get your location. Please enter an address manually.')
    } finally {
      setIsLoadingLocation(false)
    }
  }

  const handleAddressInput = async (value: string) => {
    setAddressInput(value)
    if (value.length < 3) {
      setAddressSuggestions([])
      return
    }

    try {
      const suggestions = await searchAddress(value)
      setAddressSuggestions(suggestions)
    } catch (error) {
      console.error('Error fetching address suggestions:', error)
    }
  }

  const handleLocationUpdate = (lat: number, lng: number, address: string) => {
    setSelectedLocation({
      lat,
      lng,
      address
    })
    handleSelect(JSON.stringify({
      address,
      coordinates: { lat, lng }
    }))
  }

  const renderLocationStep = () => (
    <div className="space-y-4">
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <MapPreview 
            latitude={selectedLocation.lat} 
            longitude={selectedLocation.lng}
            onLocationUpdate={handleLocationUpdate}
            allowAdjustment={true}
          />
          <p className="mt-2 text-sm text-gray-600 px-1">{selectedLocation.address}</p>
        </motion.div>
      )}

      <button
        onClick={handleCurrentLocation}
        disabled={isLoadingLocation}
        className={`
          w-full text-left px-4 py-3 rounded-lg bg-white 
          ${isLoadingLocation ? 'opacity-75' : 'hover:bg-gray-50'} 
          border border-gray-200 transition-all duration-200
        `}
      >
        <div className="flex items-center">
          <span className="text-xl mr-3">📍</span>
          <span className="font-normal">
            {isLoadingLocation ? (
              <span className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Getting your location...
              </span>
            ) : (
              'Use my current location'
            )}
          </span>
        </div>
      </button>

      {locationError && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-sm px-4"
        >
          {locationError}
        </motion.p>
      )}

      <div className="text-center text-gray-500">or</div>

      <div className="relative">
        <input
          type="text"
          placeholder="Enter address"
          value={addressInput}
          onChange={(e) => handleAddressInput(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
        
        {addressSuggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
          >
            {addressSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => {
                  const [lng, lat] = suggestion.geometry.coordinates
                  setSelectedLocation({
                    lat,
                    lng,
                    address: suggestion.place_name
                  })
                  handleSelect(JSON.stringify({
                    address: suggestion.place_name,
                    coordinates: { lat, lng }
                  }))
                  setAddressSuggestions([])
                  setAddressInput('')
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                {suggestion.place_name}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100">
        <motion.div
          className="h-full bg-[hsl(var(--brand-primary))]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="p-4 max-w-lg mx-auto pt-8">
        {/* Back button */}
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="mb-6 text-gray-600 hover:text-gray-900 transition-colors flex items-center"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-normal text-gray-900 mb-6">
              {step.question}
            </h2>

            {step.type === 'options' && (
              <div className="space-y-4"> {/* Increased spacing */}
                <div className="space-y-2">
                  {step.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value, option.label)}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg
                        ${selectedOption === option.value 
                          ? 'bg-[#4F46E5] text-white' 
                          : 'bg-white hover:bg-gray-50 border border-gray-200'
                        }
                        transition-all duration-200
                      `}
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">{option.icon}</span>
                        <span className="font-normal">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Continue button moved into the options section */}
                {selectedOption && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <button
                      onClick={handleNext}
                      className="w-full bg-[#4F46E5] text-white py-3 rounded-full font-medium hover:bg-[#4338CA] transition-colors"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {step.type === 'calendar' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date)
                      if (date) {
                        handleSelect(date.toISOString())
                      }
                    }}
                    className="custom-calendar"
                    disabled={(date) => date < new Date()}
                    initialFocus
                    showOutsideDays={false}
                  />
                </div>

                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button
                      onClick={handleNext}
                      className="w-full bg-[#4F46E5] text-white py-3 rounded-full font-medium hover:bg-[#4338CA] transition-colors"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {step.type === 'location' && (
              <div className="space-y-6">
                {renderLocationStep()}

                {selectedLocation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <button
                      onClick={handleNext}
                      className="w-full bg-[#4F46E5] text-white py-3 rounded-full font-medium hover:bg-[#4338CA] transition-colors"
                    >
                      {currentStep === steps.length - 1 ? 'Find Interpreters' : 'Continue'}
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Add results rendering */}
        {currentStep === steps.length - 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-normal text-gray-900">Available Interpreters</h2>
            <InterpreterResults
              platformInterpreters={matchedInterpreters.platformInterpreters}
              directoryInterpreters={matchedInterpreters.directoryInterpreters}
              isLoading={isSearching}
              hasSearched={hasSearched}  // Pass this new prop
            />
          </div>
        )}
      </div>
    </div>
  )
}
