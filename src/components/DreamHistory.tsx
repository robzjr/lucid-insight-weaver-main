
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Book, User, Trash, Edit, ArrowUpDown } from 'lucide-react';
import { useDreams } from '@/hooks/useDreams';

interface Dream {
  id: string;
  dreamText: string;
  createdAt: string;
  interpretations?: {
    islamic: string;
    spiritual: string;
    psychological: string;
  };
}

interface DreamHistoryProps {
  dreams: Dream[];
  onViewDream: (dream: Dream) => void;
  onNewDream: () => void;
  isDark?: boolean;
}

const DreamHistory = ({ dreams, onViewDream, onNewDream, isDark = true }: DreamHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [editingDream, setEditingDream] = useState<Dream | null>(null);
  const [editText, setEditText] = useState('');
  const { deleteDream, updateDream } = useDreams();

  // Only show dreams that have been saved (have interpretations)
  const savedDreams = dreams.filter(dream => dream.interpretations);
  
  const filteredDreams = savedDreams.filter(dream =>
    dream.dreamText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort dreams based on selected option
  const sortedDreams = [...filteredDreams].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'alphabetical':
        return a.dreamText.localeCompare(b.dreamText);
      default:
        return 0;
    }
  });

  const handleDeleteDream = (e: React.MouseEvent, dreamId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this dream? This action cannot be undone.')) {
      deleteDream(dreamId);
    }
  };

  const handleEditDream = (e: React.MouseEvent, dream: Dream) => {
    e.stopPropagation();
    setEditingDream(dream);
    setEditText(dream.dreamText);
  };

  const handleSaveEdit = () => {
    if (editingDream && editText.trim()) {
      updateDream(editingDream.id, editText.trim());
      setEditingDream(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingDream(null);
    setEditText('');
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <Card className={isDark ? 'glass-card' : 'bg-white border-slate-200'}>
        <CardHeader>
          <CardTitle className={isDark ? 'text-white' : 'text-slate-900'}>My Dream Archive</CardTitle>
          <div className="space-y-3">
            <Input
              placeholder="Search for a symbol... e.g., 'snake', 'mirror', 'falling'"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${
                isDark 
                  ? 'bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
              }`}
            />
            
            <div className="flex items-center space-x-2">
              <ArrowUpDown className={`h-4 w-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className={`flex-1 ${
                  isDark 
                    ? 'bg-slate-900/50 border-slate-700 text-slate-200' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="alphabetical">A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {sortedDreams.length === 0 ? (
        <Card className={isDark ? 'glass-card' : 'bg-white border-slate-200'}>
          <CardContent className="text-center py-8">
            <Calendar className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {savedDreams.length === 0 
                ? "No dreams saved yet. Time to start listening to your sleeping self with Ramel." 
                : "No dreams match your search"
              }
            </p>
            <Button 
              onClick={onNewDream} 
              className={`${
                isDark 
                  ? 'bg-slate-800 text-white hover:bg-slate-700' 
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              Start Dream Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedDreams.map((dream) => (
            <Card 
              key={dream.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isDark ? 'glass-card hover:bg-slate-800/50' : 'bg-white border-slate-200 hover:shadow-md'
              }`}
            >
              <CardContent className="p-4" onClick={() => onViewDream(dream)}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className={`text-sm line-clamp-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {dream.dreamText}
                    </p>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleEditDream(e, dream)}
                      className={`p-2 ${
                        isDark 
                          ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' 
                          : 'text-slate-500 hover:text-blue-500 hover:bg-slate-100'
                      }`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteDream(e, dream.id)}
                      className={`p-2 ${
                        isDark 
                          ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' 
                          : 'text-slate-500 hover:text-red-500 hover:bg-slate-100'
                      }`}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-1">
                    {dream.interpretations?.islamic && (
                      <Badge variant="secondary" className="text-xs">
                        <Book className="h-3 w-3 mr-1" />
                        Islamic
                      </Badge>
                    )}
                    {dream.interpretations?.spiritual && (
                      <Badge variant="secondary" className="text-xs">
                        <User className="h-3 w-3 mr-1" />
                        Spiritual
                      </Badge>
                    )}
                    {dream.interpretations?.psychological && (
                      <Badge variant="secondary" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        Psychology
                      </Badge>
                    )}
                  </div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {dream.createdAt}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button 
        onClick={onNewDream} 
        className={`w-full ${
          isDark 
            ? 'bg-slate-800 text-white hover:bg-slate-700' 
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        Analyze New Dream
      </Button>

      {/* Edit Dream Dialog */}
      <Dialog open={!!editingDream} onOpenChange={handleCancelEdit}>
        <DialogContent className={isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : 'text-slate-900'}>
              Edit Dream
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="dreamText" className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Dream Description
              </Label>
              <Textarea
                id="dreamText"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={6}
                className={`mt-2 ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700 text-slate-200' 
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>
          <DialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              className={isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300'}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={!editText.trim()}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DreamHistory;
