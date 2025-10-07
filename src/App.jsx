import React, { useState, useEffect } from 'react';
import { Camera, Users, Trophy, Scan, LogOut, Plus, UserPlus } from 'lucide-react';

// Simulated Firebase/Backend - Replace with real Firebase in production
const mockAuth = {
  currentUser: null,
  signIn: (email, password) => Promise.resolve({ uid: 'user123', email, displayName: email.split('@')[0] }),
  signOut: () => Promise.resolve()
};

const mockDb = {
  users: new Map(),
  teams: new Map(),
  scans: []
};

// Initialize mock data
const initializeMockData = () => {
  // Sample teams
  mockDb.teams.set('TEAM001', {
    id: 'TEAM001',
    name: 'Eco Warriors',
    joinCode: 'ECO123',
    orgType: 'RSO',
    totalBags: 45,
    points: 450,
    members: []
  });
  
  mockDb.teams.set('TEAM002', {
    id: 'TEAM002',
    name: 'Green Illini',
    joinCode: 'GRN456',
    orgType: 'Dorm',
    totalBags: 38,
    points: 380,
    members: []
  });
};

initializeMockData();

const IlliniImpactApp = () => {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [teamCode, setTeamCode] = useState('');
  const [createTeamForm, setCreateTeamForm] = useState({ name: '', orgType: 'RSO' });
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState('teams');

  // Login Screen Component
  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">II</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Illini Impact</h1>
          <p className="text-gray-600">Make a difference, one bag at a time</p>
        </div>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Sign In
          </button>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Join the sustainability movement at UIUC</p>
        </div>
      </div>
    </div>
  );

  // Join/Create Team Screen
  const JoinTeamScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <Users className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Join a Team</h2>
          <p className="text-gray-600 mt-2">Enter your team code or create a new team</p>
        </div>

        {!showCreateTeam ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Team Code"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-semibold"
              maxLength={6}
            />
            <button
              onClick={handleJoinTeam}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Join Team
            </button>
            <button
              onClick={() => setShowCreateTeam(true)}
              className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Create New Team
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Team Name"
              value={createTeamForm.name}
              onChange={(e) => setCreateTeamForm({...createTeamForm, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={createTeamForm.orgType}
              onChange={(e) => setCreateTeamForm({...createTeamForm, orgType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="RSO">RSO</option>
              <option value="Dorm">Dorm</option>
              <option value="Class">Class</option>
              <option value="Other">Other</option>
            </select>
            <button
              onClick={handleCreateTeam}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Create Team
            </button>
            <button
              onClick={() => setShowCreateTeam(false)}
              className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
            >
              Back to Join
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Home Dashboard Screen
  const HomeScreen = () => {
    const userRank = calculateUserRank();
    const teamRank = calculateTeamRank();
    
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Illini Impact</h1>
            <button onClick={handleLogout} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <LogOut size={24} />
            </button>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-sm opacity-90 mb-1">Welcome back, {user?.displayName || 'User'}!</p>
            <p className="text-xs opacity-75">{team?.name || 'No Team'}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-6 -mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-500">{user?.totalBags || 0}</p>
                <p className="text-sm text-gray-600">Bags Collected</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{user?.points || 0}</p>
                <p className="text-sm text-gray-600">Points</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">Your Rank: <span className="font-bold text-orange-500">#{userRank}</span></p>
              <p className="text-sm text-gray-600">Team Rank: <span className="font-bold text-blue-600">#{teamRank}</span></p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setScreen('scan')}
              className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-2"
            >
              <Scan size={32} />
              <span className="text-sm font-semibold">Scan</span>
            </button>
            <button
              onClick={() => setScreen('team')}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-2"
            >
              <Users size={32} />
              <span className="text-sm font-semibold">Team</span>
            </button>
            <button
              onClick={() => setScreen('leaderboard')}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-2"
            >
              <Trophy size={32} />
              <span className="text-sm font-semibold">Rank</span>
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
            {getRecentScans().length > 0 ? (
              <div className="space-y-3">
                {getRecentScans().map((scan, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Scan size={20} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{scan.bagType === 'recycle' ? 'Recycling' : 'Trash'} Bag</p>
                        <p className="text-xs text-gray-500">+{scan.pointsAwarded} points</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{formatTime(scan.createdAt)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No scans yet. Start collecting!</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Scan Screen
  const ScanScreen = () => (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <button onClick={() => setScreen('home')} className="text-white">
          ← Back
        </button>
        <h2 className="text-white font-bold">Scan Collection</h2>
        <div className="w-16"></div>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center">
        <div className="w-full max-w-md aspect-square bg-gray-800 rounded-3xl mx-4 flex items-center justify-center relative overflow-hidden">
          <Camera size={64} className="text-gray-600" />
          <div className="absolute inset-8 border-4 border-orange-500 rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/50"></div>
        </div>
      </div>

      <div className="p-6 bg-gray-800 rounded-t-3xl">
        <p className="text-white text-center mb-4">Position QR code within frame</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button className="bg-green-600 text-white py-3 rounded-xl font-semibold">
            Recycling
          </button>
          <button className="bg-gray-600 text-white py-3 rounded-xl font-semibold">
            Trash
          </button>
        </div>
        <button
          onClick={handleMockScan}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors"
        >
          Simulate Scan (Demo)
        </button>
      </div>
    </div>
  );

  // Leaderboard Screen
  const LeaderboardScreen = () => {
    const teams = Array.from(mockDb.teams.values()).sort((a, b) => b.points - a.points);
    const users = Array.from(mockDb.users.values()).sort((a, b) => b.points - a.points);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setScreen('home')} className="text-white">
              ← Back
            </button>
            <h2 className="text-xl font-bold">Leaderboard</h2>
            <div className="w-16"></div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setLeaderboardTab('teams')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                leaderboardTab === 'teams' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'
              }`}
            >
              Teams
            </button>
            <button
              onClick={() => setLeaderboardTab('users')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                leaderboardTab === 'users' ? 'bg-white text-purple-600' : 'bg-white/20 text-white'
              }`}
            >
              Individuals
            </button>
          </div>
        </div>

        <div className="p-6">
          {leaderboardTab === 'teams' ? (
            <div className="space-y-3">
              {teams.map((t, idx) => (
                <div key={t.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                    idx === 1 ? 'bg-gray-300 text-gray-700' :
                    idx === 2 ? 'bg-orange-400 text-orange-900' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.orgType} • {t.totalBags} bags</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">{t.points}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {users.slice(0, 20).map((u, idx) => (
                <div key={u.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                    idx === 1 ? 'bg-gray-300 text-gray-700' :
                    idx === 2 ? 'bg-orange-400 text-orange-900' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{u.displayName}</p>
                    <p className="text-sm text-gray-500">{u.totalBags} bags collected</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-600">{u.points}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Team Screen
  const TeamScreen = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setScreen('home')} className="text-white">
            ← Back
          </button>
          <h2 className="text-xl font-bold">My Team</h2>
          <div className="w-16"></div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users size={40} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{team?.name || 'No Team'}</h3>
            <p className="text-gray-600 mb-4">{team?.orgType || 'N/A'}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Team Join Code</p>
              <p className="text-3xl font-bold text-blue-600 tracking-widest">{team?.joinCode || 'N/A'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-orange-600">{team?.totalBags || 0}</p>
                <p className="text-sm text-gray-600">Total Bags</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">{team?.points || 0}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h4 className="font-bold text-gray-800 mb-4">Team Members</h4>
          <p className="text-gray-500 text-center py-4">Member list coming soon</p>
        </div>
      </div>
    </div>
  );

  // Helper Functions
  const handleLogin = async () => {
    if (loginForm.email && loginForm.password) {
      const authUser = await mockAuth.signIn(loginForm.email, loginForm.password);
      const newUser = {
        id: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName,
        teamId: null,
        totalBags: 0,
        points: 0,
        createdAt: new Date()
      };
      mockDb.users.set(authUser.uid, newUser);
      setUser(newUser);
      setScreen('jointeam');
    }
  };

  const handleJoinTeam = () => {
    const foundTeam = Array.from(mockDb.teams.values()).find(t => t.joinCode === teamCode);
    if (foundTeam) {
      const updatedUser = {...user, teamId: foundTeam.id};
      mockDb.users.set(user.id, updatedUser);
      setUser(updatedUser);
      setTeam(foundTeam);
      setScreen('home');
    } else {
      alert('Invalid team code');
    }
  };

  const handleCreateTeam = () => {
    if (createTeamForm.name) {
      const newTeamId = 'TEAM' + Date.now();
      const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newTeam = {
        id: newTeamId,
        name: createTeamForm.name,
        joinCode,
        orgType: createTeamForm.orgType,
        totalBags: 0,
        points: 0,
        members: [user.id],
        createdAt: new Date()
      };
      mockDb.teams.set(newTeamId, newTeam);
      const updatedUser = {...user, teamId: newTeamId};
      mockDb.users.set(user.id, updatedUser);
      setUser(updatedUser);
      setTeam(newTeam);
      setScreen('home');
    }
  };

  const handleMockScan = () => {
    const scan = {
      id: 'SCAN' + Date.now(),
      userId: user.id,
      teamId: user.teamId,
      bagType: Math.random() > 0.5 ? 'recycle' : 'trash',
      pointsAwarded: 10,
      createdAt: new Date()
    };
    mockDb.scans.push(scan);
    
    const updatedUser = {
      ...user,
      totalBags: user.totalBags + 1,
      points: user.points + scan.pointsAwarded
    };
    mockDb.users.set(user.id, updatedUser);
    setUser(updatedUser);
    
    if (team) {
      const updatedTeam = {
        ...team,
        totalBags: team.totalBags + 1,
        points: team.points + scan.pointsAwarded
      };
      mockDb.teams.set(team.id, updatedTeam);
      setTeam(updatedTeam);
    }
    
    setScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    setTeam(null);
    setScreen('login');
  };

  const getRecentScans = () => {
    return mockDb.scans.filter(s => s.userId === user?.id).slice(-3).reverse();
  };

  const calculateUserRank = () => {
    const allUsers = Array.from(mockDb.users.values()).sort((a, b) => b.points - a.points);
    return allUsers.findIndex(u => u.id === user?.id) + 1;
  };

  const calculateTeamRank = () => {
    const allTeams = Array.from(mockDb.teams.values()).sort((a, b) => b.points - a.points);
    return allTeams.findIndex(t => t.id === team?.id) + 1;
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Render current screen
  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-2xl">
      {screen === 'login' && <LoginScreen />}
      {screen === 'jointeam' && <JoinTeamScreen />}
      {screen === 'home' && <HomeScreen />}
      {screen === 'scan' && <ScanScreen />}
      {screen === 'leaderboard' && <LeaderboardScreen />}
      {screen === 'team' && <TeamScreen />}
    </div>
  );
};

export default IlliniImpactApp;