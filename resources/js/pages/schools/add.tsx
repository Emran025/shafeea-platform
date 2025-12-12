import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
  ArrowLeftIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  HomeIcon,
  PhotoIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import AppLayout from '@/layouts/app-layout';
import { DocumentData } from '@/types';

interface FormData {
  name: string;
  phone: string;
  country: string;
  city: string;
  location: string;
  address: string;
  logo: string;
  documents: DocumentData[];
}

export default function Create() {
  const { data, setData, post, errors, processing } = useForm<FormData>({
    name: '',
    phone: '',
    country: '',
    city: '',
    location: '',
    address: '',
    logo: '',
    documents: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('schools.store'));
  };

  const addCertificate = () => {
    setData('documents', [...data.documents, {
        name: '',
        certificate_type: '',
        certificate_type_other: '',
        riwayah: '',
        issuing_place: '',
        issuing_date: '',
        file: null,
    }]);
  };

  const handleDocumentChange = <K extends keyof DocumentData>(index: number, field: K, value: DocumentData[K]) => {
      const documents = [...data.documents];
      documents[index][field] = value;
      setData('documents', documents);
  };

  return (
    <AppLayout>
      <Head title="Create School" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={route('schools.index')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Schools
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Create New School</h1>
                <p className="text-sm text-gray-600">Add a new educational institution to the system</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name *
                  </label>
                  <div className="relative">
                    <BuildingOfficeIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter school name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <PhoneIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL (Optional)
                  </label>
                  <div className="relative">
                    <PhotoIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      value={data.logo}
                      onChange={(e) => setData('logo', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.logo ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  {errors.logo && (
                    <p className="mt-1 text-sm text-red-600">{errors.logo}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Location Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <div className="relative">
                    <GlobeAltIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={data.country}
                      onChange={(e) => setData('country', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.country ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter country"
                    />
                  </div>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <div className="relative">
                    <MapPinIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={data.city}
                      onChange={(e) => setData('city', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter city"
                    />
                  </div>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPinIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={data.location}
                      onChange={(e) => setData('location', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.location ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter location/district"
                    />
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address *
                  </label>
                  <div className="relative">
                    <HomeIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                    <textarea
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      rows={3}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                        errors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter complete address"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Certificates & Documents</h2>
              {data.documents.map((doc, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-200 pb-6 mb-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Document Name *</label>
                        <input type="text" value={doc.name} onChange={(e) => handleDocumentChange(index, 'name', e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Type</label>
                        <select value={doc.certificate_type} onChange={(e) => handleDocumentChange(index, 'certificate_type', e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                            <option value="">Select Type</option>
                            <option value="شهادة حفظ قران">شهادة حفظ قران</option>
                            <option value="شهادة إجازة في القران">شهادة إجازة في القران</option>
                            <option value="سيرة ذاتية">سيرة ذاتية</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    {doc.certificate_type === 'Other' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Other Type</label>
                            <input type="text" value={doc.certificate_type_other} onChange={(e) => handleDocumentChange(index, 'certificate_type_other', e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                        </div>
                    )}
                    {(doc.certificate_type === 'شهادة حفظ قران' || doc.certificate_type === 'شهادة إجازة في القران') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Riwayah</label>
                            <select value={doc.riwayah} onChange={(e) => handleDocumentChange(index, 'riwayah', e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                                <option value="">Select Riwayah</option>
                                <option value="قراءة الإمام نافع المدني">قراءة الإمام نافع المدني</option>
                                <option value="قراءة الإمام عبد الله بن كثير المكي">قراءة الإمام عبد الله بن كثير المكي</option>
                                <option value="قراءة الإمام أبو عمرو البصري">قراءة الإمام أبو عمرو البصري</option>
                                <option value="قراءة الإمام بن عامر الدمشقي">قراءة الإمام بن عامر الدمشقي</option>
                                <option value="قراءة الإمام عاصم بن أبي النجود الكوفي">قراءة الإمام عاصم بن أبي النجود الكوفي</option>
                                <option value="قراءة الإمام حمزة الزيات">قراءة الإمام حمزة الزيات</option>
                                <option value="قراءة الإمام الكسائي">قراءة الإمام الكسائي</option>
                                <option value="قراءة الإمام أبو جعفر المدني">قراءة الإمام أبو جعفر المدني</option>
                                <option value="قراءة الإمام يعقوب الحضرمي">قراءة الإمام يعقوب الحضرمي</option>
                                <option value="قراءة الإمام خلف العاشر">قراءة الإمام خلف العاشر</option>
                            </select>
                        </div>
                    )}
                    {doc.certificate_type !== 'سيرة ذاتية' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Place</label>
                                <input type="text" value={doc.issuing_place} onChange={(e) => handleDocumentChange(index, 'issuing_place', e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Date</label>
                                <input type="date" value={doc.issuing_date} onChange={(e) => handleDocumentChange(index, 'issuing_date', e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
                            </div>
                        </>
                    )}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                        <input type="file" onChange={(e) => handleDocumentChange(index, 'file', e.target.files ? e.target.files[0] : null)} className="w-full px-4 py-3 border rounded-lg" />
                    </div>
                </div>
              ))}
              <button
                  type="button"
                  onClick={addCertificate}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                  <PlusCircleIcon className="w-5 h-5" />
                  Add Another Certificate
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Link
                href={route('schools.index')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? 'Creating...' : 'Create School'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
