const { contextBridge, ipcRenderer } = require('electron')

function on(channel, callback) {
  const handler = (_event, payload) => callback(payload)
  ipcRenderer.on(channel, handler)
  return () => ipcRenderer.removeListener(channel, handler)
}

contextBridge.exposeInMainWorld('mindpingElectron', {
  startSession: (payload) => ipcRenderer.invoke('mindping:start-session', payload),
  stopSession: () => ipcRenderer.invoke('mindping:stop-session'),
  checkAnswer: (payload) => ipcRenderer.invoke('mindping:check-answer', payload),
  transcribeAudio: (payload) => ipcRenderer.invoke('mindping:transcribe-audio', payload),
  showTestNotification: () => ipcRenderer.invoke('mindping:show-test-notification'),
  onQuestionFired: (callback) => on('mindping:question-fired', callback),
  onOpenQuestion: (callback) => on('mindping:open-question', callback),
  onSessionStopped: (callback) => on('mindping:session-stopped', callback),
})
