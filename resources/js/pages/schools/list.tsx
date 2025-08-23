import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  UsersIcon,
  AcademicCapIcon,
  MapPinIcon,
  PhoneIcon,
  ChevronRightIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';

interface School {
  id: number;
  name: string;
  phone: string;
  country: string;
  city: string;
  location: string;
  address: string;
  logo?: string;
  users_count: number;
  halaqahs_count: number;
  created_at: string;
}

interface Props {
  schools: {
    data: School[];
    links: any;
    meta: any;
  };
  filters: {
    search?: string;
    country?: string;
    city?: string;
  };
  countries: string[];
  cities: string[];
}

export default function Index({ schools, filters, countries, cities }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCountry, setSelectedCountry] = useState(filters.country || '');
  const [selectedCity, setSelectedCity] = useState(filters.city || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    router.get(route('schools.index'), {
      search: searchTerm,
      country: selectedCountry,
      city: selectedCity,
    }, { preserveState: true });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedCity('');
    router.get(route('schools.index'), {}, { preserveState: true });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Schools Management" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schools</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage educational institutions and their information
            </p>
          </div>
          <Link
            href={route('schools.create')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add School
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search schools by name, city, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Filters Dropdown */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Schools Grid */}
        {schools.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.data.map((school) => (
              <div
                key={school.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* School Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        {school.logo ? (
                          <img 
                            src={school.logo} 
                            alt={school.name}
                            className="w-8 h-8 rounded"
                          />
                        ) : (
                          <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {school.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* School Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{school.city}, {school.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <PhoneIcon className="w-4 h-4" />
                      <span>{school.phone}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <UsersIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500">Users</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {school.users_count}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <AcademicCapIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500">Halaqahs</span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {school.halaqahs_count}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={route('schools.show', school.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                      <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      href={route('schools.edit', school.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-500 mb-6">
              {filters.search || filters.country || filters.city
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by creating your first school.'}
            </p>
            <Link
              href={route('schools.create')}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add School
            </Link>
          </div>
        )}

        {/* Pagination */}
        {schools.data.length > 0 && schools.meta.last_page > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {schools.meta.from} to {schools.meta.to} of {schools.meta.total} results
            </div>
            <div className="flex gap-2">
              {schools.links.map((link: any, index: number) => (
                <Link
                  key={index}
                  href={link.url || '#'}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    link.active
                      ? 'bg-blue-600 text-white'
                      : link.url
                      ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}