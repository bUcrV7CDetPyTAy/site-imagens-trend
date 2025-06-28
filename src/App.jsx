import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { 
  Menu, 
  Search, 
  Crown, 
  MoreVertical, 
  Folder, 
  Image, 
  Video, 
  Music, 
  Smartphone,
  Trash2,
  Download,
  FileText,
  Archive,
  Wifi,
  HardDrive,
  PieChart,
  Settings,
  Plus,
  Globe
} from 'lucide-react'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('home')

  const folders = [
    { name: 'DCIM', items: '19 item', type: 'drw', date: '6/26/25 09:23 PM' },
    { name: 'Download', items: '537 item', type: 'drw', date: '6/24/25 02:29 PM' },
    { name: '.DataStorage', items: '1 item', type: 'drw', date: '6/26/25 11:39 PM' },
    { name: 'Documents', items: '9 item', type: 'drw', date: '6/25/25 08:17 PM' },
    { name: 'Pictures', items: '8 item', type: 'drw', date: '6/24/25 02:28 PM' },
    { name: 'Movies', items: '27 item', type: 'drw', date: '6/24/25 02:26 PM' },
    { name: 'Ringtones', items: '1 item', type: 'drw', date: '6/24/25 01:58 PM' },
    { name: 'Music', items: '6 item', type: 'drw', date: '6/24/25 01:58 PM' },
    { name: 'pesadelo', items: '3 item', type: 'drw', date: '6/23/25 11:10 PM' },
    { name: '.aceself', items: '12 item', type: 'drw', date: '6/20/25 12:33 PM' },
    { name: 'backups', items: '9 item', type: 'drw', date: '6/09/05 09:50 AM' }
  ]

  const tools = [
    { name: 'Images', icon: Image, color: 'bg-red-500' },
    { name: 'Videos', icon: Video, color: 'bg-blue-500' },
    { name: 'Music', icon: Music, color: 'bg-purple-500' },
    { name: 'APP', icon: Smartphone, color: 'bg-green-500' },
    { name: 'Cleaner', icon: Settings, color: 'bg-green-500' },
    { name: 'Disguised videos', icon: Video, color: 'bg-blue-500' },
    { name: 'Disguised images', icon: Image, color: 'bg-blue-500' },
    { name: 'New Files', icon: FileText, color: 'bg-orange-500' },
    { name: 'Compressed', icon: Archive, color: 'bg-blue-500' },
    { name: 'View on PC', icon: HardDrive, color: 'bg-blue-500' },
    { name: 'Downloader', icon: Download, color: 'bg-teal-500' },
    { name: 'Documents', icon: FileText, color: 'bg-yellow-500' },
    { name: 'LAN', icon: Wifi, color: 'bg-blue-500' },
    { name: 'FTP', icon: HardDrive, color: 'bg-blue-500' },
    { name: 'Recycle Bin', icon: Trash2, color: 'bg-gray-500' },
    { name: 'All Tools', icon: MoreVertical, color: 'bg-gray-500' }
  ]

  const HomeView = () => (
    <div className="space-y-6">
      {/* Storage Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Internal Storage</h3>
                <p className="text-sm opacity-90">134.09 GB / 223.08 GB</p>
              </div>
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-white/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-white border-r-transparent transform rotate-45"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">60%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400 to-blue-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">File Analyzer</h3>
                <p className="text-sm opacity-90">More files to clean</p>
              </div>
              <PieChart className="w-12 h-12" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-4 gap-4">
        {tools.map((tool, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className={`w-12 h-12 rounded-2xl ${tool.color} flex items-center justify-center text-white shadow-lg`}>
              <tool.icon className="w-6 h-6" />
            </div>
            <span className="text-xs text-center text-gray-700">{tool.name}</span>
          </div>
        ))}
      </div>

      {/* Bookmarks Section */}
      <div className="space-y-4">
        <h3 className="text-blue-500 font-medium">Bookmarks</h3>
        <div className="flex space-x-4">
          <Button variant="outline" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Web Search</span>
          </Button>
        </div>
      </div>
    </div>
  )

  const LocalView = () => (
    <div className="space-y-4">
      {/* Path Bar */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <span>/</span>
        <span>&gt;storage&gt;emulated&gt;</span>
        <span>0</span>
        <div className="ml-auto flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span>60%</span>
        </div>
      </div>

      {/* Folder List */}
      <div className="space-y-2">
        {folders.map((folder, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Folder className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">{folder.name}</h4>
                <span className="text-sm text-gray-500">{folder.date}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{folder.items}</span>
                <span>{folder.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Menu className="w-6 h-6" />
            <div className="flex items-center space-x-2">
              <Folder className="w-5 h-5" />
              <span className="font-medium">
                {currentView === 'home' ? 'Home' : 'Local'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Crown className="w-6 h-6" />
            <Search className="w-6 h-6" />
            <MoreVertical className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              currentView === 'home'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('local')}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              currentView === 'local'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Local
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {currentView === 'home' ? <HomeView /> : <LocalView />}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-200 h-1 rounded-full"></div>
    </div>
  )
}

export default App

