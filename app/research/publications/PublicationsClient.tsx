'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, ExternalLink, Calendar, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const defaultPublications = [
  {
    id: 1,
    title: 'Advanced Neural Network Architectures for Medical Image Analysis',
    authors: ['Dr. Sarah Johnson', 'Prof. Michael Chen', 'Dr. Emily Rodriguez'],
    journal: 'IEEE Transactions on Medical Imaging',
    year: 2024,
    category: 'AI & Healthcare',
    type: 'Journal Article',
    citations: 45,
    abstract:
      'This paper presents novel neural network architectures specifically designed for medical image analysis, achieving state-of-the-art performance in diagnostic accuracy.',
    doi: '10.1109/TMI.2024.001',
    keywords: ['Deep Learning', 'Medical Imaging', 'Neural Networks', 'Computer Vision'],
  },
];

interface PublicationsClientProps {
  initialPublications: any[];
}

export default function PublicationsClient({ initialPublications }: PublicationsClientProps) {
  const seed = initialPublications.length > 0 ? initialPublications : defaultPublications;
  const [publications] = useState<any[]>(seed);
  const [filteredPublications, setFilteredPublications] = useState<any[]>(seed);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    let filtered = publications;

    if (searchTerm) {
      filtered = filtered.filter(
        (pub: any) =>
          pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (pub.authors || []).some((author: string) => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
          pub.journal.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (pub.keywords || []).some((keyword: string) => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((pub) => pub.category === selectedCategory);
    }

    if (selectedYear !== 'all') {
      filtered = filtered.filter((pub) => pub.year.toString() === selectedYear);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter((pub) => pub.type === selectedType);
    }

    setFilteredPublications(filtered);
  }, [searchTerm, selectedCategory, selectedYear, selectedType, publications]);

  const categories = [...new Set(publications.map((p) => p.category))];
  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);
  const types = [...new Set(publications.map((p) => p.type))];
  const totalCitations = publications.reduce((sum, p) => sum + p.citations, 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Research Publications</h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto">
              Explore our comprehensive collection of research papers, articles, and publications that contribute to the advancement of science and technology.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white" />
                <Input
                  placeholder="Search publications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-white/60 text-white placeholder-gray-300"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{publications.length}</div>
              <div className="text-blue-100">Total Publications</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{totalCitations}</div>
              <div className="text-blue-100">Total Citations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2">{categories.length}</div>
              <div className="text-blue-100">Research Areas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                {publications.length > 0 ? Math.round(totalCitations / publications.length) : 0}
              </div>
              <div className="text-blue-100">Avg. Citations</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{filteredPublications.length} Publications Found</h2>
            <p className="text-gray-600">Browse our research contributions across various domains and publication venues.</p>
          </motion.div>

          {filteredPublications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Publications Found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredPublications.map((publication, index) => (
                <motion.article
                  key={publication.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="publication-card bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 lg:pr-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <Badge variant="secondary">{publication.category}</Badge>
                        <Badge variant="outline">{publication.type}</Badge>
                        <span className="text-sm text-gray-500">{publication.year}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">{publication.title}</h3>

                      <div className="flex items-center space-x-2 mb-4 text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{(publication.authors || []).join(', ')}</span>
                      </div>

                      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{publication.journal}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{publication.year}</span>
                        </div>
                        <span>{publication.citations} citations</span>
                      </div>

                      <p className="text-gray-600 mb-6 leading-relaxed">{publication.abstract}</p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {(publication.keywords || []).map((keyword: string) => (
                          <span key={keyword} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                            {keyword}
                          </span>
                        ))}
                      </div>

                      <div className="text-sm text-gray-500 mb-4">DOI: {publication.doi}</div>
                    </div>

                    <div className="flex flex-col space-y-3 lg:w-48">
                      <Button size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Online
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full">
                        Cite Paper
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
