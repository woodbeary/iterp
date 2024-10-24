import { motion } from 'framer-motion'
import { Info, Star, CheckCircle, MapPin, Clock } from 'lucide-react'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { PlatformInterpreter, BaseInterpreter } from '@/types/interpreter'

type InterpreterResultsProps = {
  platformInterpreters: PlatformInterpreter[]
  directoryInterpreters: BaseInterpreter[]
  isLoading: boolean
  hasSearched: boolean  // Add this new prop
  userLocation?: { lat: number; lng: number }
}

export function InterpreterResults({ 
  platformInterpreters, 
  directoryInterpreters, 
  isLoading,
  hasSearched,  // Add this to destructuring
  userLocation 
}: InterpreterResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding interpreters in your area...</p>
        </div>
      </div>
    )
  }

  // Only show "No interpreters found" if we've actually performed a search
  if (hasSearched && platformInterpreters.length === 0 && directoryInterpreters.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <div className="mb-4">😕</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No interpreters found</h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          We couldn't find any interpreters in your area. Try expanding your search radius or changing your location.
        </p>
      </div>
    )
  }

  // If we haven't searched yet, don't show anything
  if (!hasSearched) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Platform Interpreters Section */}
      {platformInterpreters.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg flex items-center">
              Platform Interpreters
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Priority Matching
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 ml-2 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm max-w-xs">
                      Platform interpreters are verified members with instant booking, secure payments, and ratings.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
          </div>

          <div className="space-y-3">
            {platformInterpreters.map((interpreter) => (
              <motion.div
                key={interpreter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <h4 className="font-medium text-lg">{interpreter.name}</h4>
                      {interpreter.platformVerified && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CheckCircle className="w-5 h-5 ml-1.5 text-blue-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">Verified Platform Member</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {interpreter.location.city}, {interpreter.location.state}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {interpreter.certifications.join(', ')}
                      </div>
                      {interpreter.rating && (
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          <span>
                            {interpreter.rating.toFixed(1)} ({interpreter.totalRatings} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Directory Interpreters Section */}
      {directoryInterpreters.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg flex items-center">
              Directory Interpreters
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 ml-2 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm max-w-xs">
                      Contact these certified interpreters directly to arrange services.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
          </div>

          <div className="space-y-3">
            {directoryInterpreters.map((interpreter) => (
              <motion.div
                key={interpreter.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium mb-2">{interpreter.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {interpreter.location.city}, {interpreter.location.state}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {interpreter.certifications.join(', ')}
                      </div>
                      <div className="text-sm text-gray-500">
                        Source: {interpreter.source}
                      </div>
                    </div>
                  </div>
                  {interpreter.phone && (
                    <a 
                      href={`tel:${interpreter.phone}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                    >
                      {interpreter.phone}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
