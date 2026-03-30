import React from 'react'

// React icons for my Service grid
import {
  FaHeadphonesAlt,
  FaWallet,
  FaCheckCircle,
} from 'react-icons/fa'
import { FaCarSide } from 'react-icons/fa6'

const ServiceData = [
  {
    id: 1,
    icon: FaCarSide,
    title: 'Free Delivery',
    description: 'Free Delivery on all orders',
  },
  {
    id: 2,
    icon: FaCheckCircle,
    title: 'Safe Money',
    description: '30 days money back guarantee',
  },
  {
    id: 3,
    icon: FaWallet,
    title: 'Secure Payment',
    description: 'All payments are secured',
  },
  {
    id: 4,
    icon: FaHeadphonesAlt,
    title: '24/7 Support',
    description: 'Friendly customer support',
  },
]

const Services = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Service Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {ServiceData.map((service) => {
            const Icon = service.icon

            return (
              <div
                key={service.id}
                className="flex flex-col items-center text-center p-6 rounded-2xl shadow-xl hover:shadow-2xl transition"
              >
                <Icon className="text-4xl text-blue-600 mb-4" />

                <h3 className="text-lg font-semibold mb-2">
                  {service.title}
                </h3>

                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </div>
            )
          })}

        </div>
      </div>
    </section>
  )
}

export default Services
