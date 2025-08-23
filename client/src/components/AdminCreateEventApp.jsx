"use client";
import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Mail, Phone, Globe, Building, 
  GraduationCap, Ticket, Tag, Clock, Image as ImageIcon,
  Plus, X, Check, AlertCircle, Upload, Save, Eye,
  ChevronDown, ChevronUp, Zap, Star, Heart, Music,
  Camera, Utensils, Trophy, Gamepad2, BookOpen, Briefcase
} from 'lucide-react';

// Router Context (reuse from previous component)
const RouterContext = createContext();
const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
};

// Utility function for className merging
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Form validation utility
const validateForm = (formData, eventType) => {
  const errors = {};
  
  // Required fields for all events
  if (!formData.title?.trim()) errors.title = "Event title is required";
  if (!formData.description?.trim()) errors.description = "Event description is required";
  if (!formData.date) errors.date = "Event date is required";
  if (!formData.startTime) errors.startTime = "Start time is required";
  if (!formData.endTime) errors.endTime = "End time is required";
  if (!formData.category) errors.category = "Event category is required";
  if (!formData.maxAttendees || formData.maxAttendees < 1) errors.maxAttendees = "Maximum attendees must be at least 1";
  
  // Organizer info
  if (!formData.organizer.name?.trim()) errors.organizerName = "Organizer name is required";
  if (!formData.organizer.email?.trim()) errors.organizerEmail = "Organizer email is required";
  if (!formData.organizer.phone?.trim()) errors.organizerPhone = "Organizer phone is required";
  
  // Event type specific validations
  if (eventType === 'college') {
    if (!formData.collegeName?.trim()) errors.collegeName = "College name is required";
    if (!formData.collegeVenue?.trim()) errors.collegeVenue = "College venue is required";
  } else {
    if (!formData.city?.trim()) errors.city = "City is required";
    if (!formData.venue?.trim()) errors.venue = "Venue is required";
    if (!formData.address?.trim()) errors.address = "Address is required";
  }
  
  return errors;
};

// Event type selection component
const EventTypeSelector = ({ selectedType, onSelect }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          What type of event are you creating?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the type that best describes your event
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('college')}
          className={cn(
            "cursor-pointer rounded-2xl p-8 border-2 transition-all duration-300",
            selectedType === 'college'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
          )}
        >
          <div className="text-center">
            <div className={cn(
              "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center",
              selectedType === 'college'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            )}>
              <GraduationCap className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              College Event
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Events hosted within college premises for students and faculty
            </p>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('local')}
          className={cn(
            "cursor-pointer rounded-2xl p-8 border-2 transition-all duration-300",
            selectedType === 'local'
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
              : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
          )}
        >
          <div className="text-center">
            <div className={cn(
              "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center",
              selectedType === 'local'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            )}>
              <Building className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Local Event
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Public events in your city open to the general community
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Image upload component
const ImageUploader = ({ images, onImagesChange }) => {
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    onImagesChange([...images, ...newImages]);
  };

  const removeImage = (id) => {
    const updatedImages = images.filter(img => img.id !== id);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Event Images
      </label>
      
      {/* Upload area */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            Click to upload event images
          </p>
          <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
        </label>
      </div>
      
      {/* Image preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Tag input component
const TagInput = ({ tags, onTagsChange }) => {
  const [inputValue, setInputValue] = useState('');

  const predefinedTags = [
    'Music', 'Dance', 'Art', 'Technology', 'Sports', 'Food', 
    'Workshop', 'Conference', 'Networking', 'Cultural', 'Educational', 'Entertainment'
  ];

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        Event Tags
      </label>
      
      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(inputValue.trim());
            }
          }}
          placeholder="Add a tag..."
          className="flex-1 p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
        <button
          type="button"
          onClick={() => addTag(inputValue.trim())}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      {/* Predefined tags */}
      <div className="flex flex-wrap gap-2">
        {predefinedTags.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => addTag(tag)}
            disabled={tags.includes(tag)}
            className={cn(
              "px-3 py-1 text-xs rounded-full transition-colors",
              tags.includes(tag)
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {tag}
          </button>
        ))}
      </div>
      
      {/* Selected tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-blue-900 dark:hover:text-blue-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Agenda builder component
const AgendaBuilder = ({ agenda, onAgendaChange }) => {
  const addAgendaItem = () => {
    onAgendaChange([...agenda, { id: Date.now(), time: '', activity: '' }]);
  };

  const updateAgendaItem = (id, field, value) => {
    onAgendaChange(agenda.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeAgendaItem = (id) => {
    onAgendaChange(agenda.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          Event Agenda (Optional)
        </label>
        <button
          type="button"
          onClick={addAgendaItem}
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>
      
      {agenda.map((item, index) => (
        <div key={item.id} className="flex gap-3 items-start">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold">
            {index + 1}
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="time"
              value={item.time}
              onChange={(e) => updateAgendaItem(item.id, 'time', e.target.value)}
              className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
            <div className="md:col-span-2 flex gap-2">
              <input
                type="text"
                value={item.activity}
                onChange={(e) => updateAgendaItem(item.id, 'activity', e.target.value)}
                placeholder="Activity description..."
                className="flex-1 p-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeAgendaItem(item.id)}
                className="p-2 text-red-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Create Event Component
const CreateEventComponent = () => {
  const { navigate } = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [eventType, setEventType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    // Basic info
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    category: '',
    price: 'free',
    ticketPrice: '',
    maxAttendees: '',
    
    // Location (conditional)
    city: '',
    venue: '',
    address: '',
    collegeName: '',
    collegeVenue: '',
    
    // Organizer info
    organizer: {
      name: '',
      email: '',
      phone: '',
      website: ''
    },
    
    // Additional
    tags: [],
    images: [],
    agenda: []
  });

  const categories = [
    { value: 'workshop', label: 'Workshop', icon: BookOpen },
    { value: 'conference', label: 'Conference', icon: Briefcase },
    { value: 'cultural', label: 'Cultural', icon: Music },
    { value: 'sports', label: 'Sports', icon: Trophy },
    { value: 'entertainment', label: 'Entertainment', icon: Camera },
    { value: 'food', label: 'Food & Dining', icon: Utensils },
    { value: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { value: 'networking', label: 'Networking', icon: Users }
  ];

  const steps = [
    { title: 'Event Type', subtitle: 'Choose your event type' },
    { title: 'Basic Info', subtitle: 'Tell us about your event' },
    { title: 'Location', subtitle: 'Where will it happen?' },
    { title: 'Organizer', subtitle: 'Contact information' },
    { title: 'Details', subtitle: 'Additional information' },
    { title: 'Preview', subtitle: 'Review and submit' }
  ];

  const updateFormData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep === 0 && !eventType) {
      alert('Please select an event type');
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formData, eventType);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      alert('Please fix the errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Event created:', { ...formData, type: eventType });
      
      // Navigate to "Your Events" page
      navigate('/admin/events');
      
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Event Type Selection
        return (
          <EventTypeSelector
            selectedType={eventType}
            onSelect={setEventType}
          />
        );

      case 1: // Basic Information
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Basic Event Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                    errors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  )}
                  placeholder="Enter event title..."
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Event Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={4}
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                    errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  )}
                  placeholder="Describe your event..."
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateFormData('date', e.target.value)}
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                    errors.date ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  )}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => updateFormData('startTime', e.target.value)}
                    className={cn(
                      "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                      errors.startTime ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    )}
                  />
                  {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => updateFormData('endTime', e.target.value)}
                    className={cn(
                      "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                      errors.endTime ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    )}
                  />
                  {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => updateFormData('category', cat.value)}
                        className={cn(
                          "p-3 text-left border rounded-lg transition-all duration-200 flex items-center gap-2",
                          formData.category === cat.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Pricing
                </label>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="free"
                        checked={formData.price === 'free'}
                        onChange={(e) => updateFormData('price', e.target.value)}
                        className="mr-2"
                      />
                      Free Event
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="paid"
                        checked={formData.price === 'paid'}
                        onChange={(e) => updateFormData('price', e.target.value)}
                        className="mr-2"
                      />
                      Paid Event
                    </label>
                  </div>
                  
                  {formData.price === 'paid' && (
                    <input
                      type="number"
                      value={formData.ticketPrice}
                      onChange={(e) => updateFormData('ticketPrice', e.target.value)}
                      placeholder="Ticket price..."
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                    />
                  )}
                </div>
              </div>

              {/* Max Attendees */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Attendees *
                </label>
                <input
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => updateFormData('maxAttendees', parseInt(e.target.value))}
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                    errors.maxAttendees ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  )}
                  placeholder="Maximum number of attendees..."
                />
                {errors.maxAttendees && <p className="text-red-500 text-xs mt-1">{errors.maxAttendees}</p>}
              </div>
            </div>
          </div>
        );

      case 2: // Location Information
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Event Location
            </h3>
            
            {eventType === 'college' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    College Name *
                  </label>
                  <input
                    type="text"
                    value={formData.collegeName}
                    onChange={(e) => updateFormData('collegeName', e.target.value)}
                    className={cn(
                      "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                      errors.collegeName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    )}
                    placeholder="Enter college name..."
                  />
                  {errors.collegeName && <p className="text-red-500 text-xs mt-1">{errors.collegeName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Venue (within college) *
                  </label>
                  <input
                    type="text"
                    value={formData.collegeVenue}
                    onChange={(e) => updateFormData('collegeVenue', e.target.value)}
                    className={cn(
                      "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                      errors.collegeVenue ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    )}
                    placeholder="e.g., Main Auditorium, Conference Hall..."
                  />
                  {errors.collegeVenue && <p className="text-red-500 text-xs mt-1">{errors.collegeVenue}</p>}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    className={cn(
                      "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                      errors.city ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    )}
                    placeholder="Enter city name..."
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => updateFormData('venue', e.target.value)}
                    className={cn(
                      "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                      errors.venue ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    )}
                    placeholder="Enter venue name..."
                  />
                  {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    rows={3}
                    className={cn(
                      "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                      errors.address ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                    )}
                    placeholder="Enter complete address..."
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
              </div>
            )}
          </div>
        );

      case 3: // Organizer Information
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Organizer Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Organizer Name *
                </label>
                <input
                  type="text"
                  value={formData.organizer.name}
                  onChange={(e) => updateFormData('organizer.name', e.target.value)}
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                    errors.organizerName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  )}
                  placeholder="Your name or organization..."
                />
                {errors.organizerName && <p className="text-red-500 text-xs mt-1">{errors.organizerName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.organizer.email}
                  onChange={(e) => updateFormData('organizer.email', e.target.value)}
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                    errors.organizerEmail ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  )}
                  placeholder="your.email@example.com"
                />
                {errors.organizerEmail && <p className="text-red-500 text-xs mt-1">{errors.organizerEmail}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.organizer.phone}
                  onChange={(e) => updateFormData('organizer.phone', e.target.value)}
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white",
                    errors.organizerPhone ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                  )}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.organizerPhone && <p className="text-red-500 text-xs mt-1">{errors.organizerPhone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  value={formData.organizer.website}
                  onChange={(e) => updateFormData('organizer.website', e.target.value)}
                  className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="https://your-website.com"
                />
              </div>
            </div>
          </div>
        );

      case 4: // Additional Details
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Additional Details
            </h3>
            
            {/* Image Upload */}
            <ImageUploader 
              images={formData.images}
              onImagesChange={(images) => updateFormData('images', images)}
            />
            
            {/* Tag Input */}
            <TagInput
              tags={formData.tags}
              onTagsChange={(tags) => updateFormData('tags', tags)}
            />
            
            {/* Agenda Builder */}
            <AgendaBuilder
              agenda={formData.agenda}
              onAgendaChange={(agenda) => updateFormData('agenda', agenda)}
            />
          </div>
        );

      case 5: // Preview
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Event Preview
            </h3>
            
            {/* Event Preview Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Header Image */}
              {formData.images.length > 0 && (
                <div className="h-64 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                  <img 
                    src={formData.images[0].url} 
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-bold",
                      formData.price === 'free' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                    )}>
                      {formData.price === 'free' ? 'Free' : `$${formData.ticketPrice}`}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-6 space-y-6">
                {/* Title and Description */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    {formData.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {formData.description}
                  </p>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Event Details</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {new Date(formData.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-purple-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {formData.startTime} - {formData.endTime}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-red-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {eventType === 'college' 
                            ? `${formData.collegeVenue}, ${formData.collegeName}`
                            : `${formData.venue}, ${formData.city}`
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Up to {formData.maxAttendees} attendees
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Tag className="h-5 w-5 text-yellow-500" />
                        <span className="text-gray-700 dark:text-gray-300 capitalize">
                          {formData.category}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {formData.tags.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Organizer Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Organizer</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {formData.organizer.name}
                      </h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formData.organizer.email}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formData.organizer.phone}
                          </span>
                        </div>
                        
                        {formData.organizer.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-purple-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {formData.organizer.website}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Agenda Preview */}
                    {formData.agenda.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Agenda</h4>
                        <div className="space-y-2">
                          {formData.agenda.map((item, index) => (
                            <div key={index} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <span className="font-medium text-blue-600 dark:text-blue-400 text-sm">
                                {item.time}
                              </span>
                              <span className="text-gray-700 dark:text-gray-300 text-sm">
                                {item.activity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Event Buddy</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create New Event</p>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/admin/events')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      {eventType && (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                    index <= currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  )}>
                    {index < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  <div className="ml-3 hidden sm:block">
                    <p className={cn(
                      "text-sm font-medium",
                      index <= currentStep
                        ? 'text-gray-900 dark:text-gray-100'
                        : 'text-gray-500 dark:text-gray-500'
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {step.subtitle}
                    </p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-12 h-0.5 mx-4",
                      index < currentStep ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {eventType && (
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-all duration-200",
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              Previous
            </button>
            
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Event...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Event
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Router Provider component (for demo purposes)
const RouterProvider = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('/admin/create-event');
  const [eventData, setEventData] = useState(null);

  const navigate = (route, data = null) => {
    console.log('Navigating to:', route, data ? 'with data' : 'without data');
    setCurrentRoute(route);
    if (data) setEventData(data);
    
    // Simulate navigation feedback
    if (route === '/admin/events') {
      alert('🎉 Event created successfully! Redirecting to Your Events page...');
    }
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, eventData, setEventData }}>
      {children}
    </RouterContext.Provider>
  );
};

// Main App Component
const AdminCreateEventApp = () => {
  return (
    <RouterProvider>
      <CreateEventComponent />
    </RouterProvider>
  );
};

export default AdminCreateEventApp;
