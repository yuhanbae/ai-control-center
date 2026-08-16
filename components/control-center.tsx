'use client'

import { useState } from 'react'
import {
  Activity,
  Bot,
  ChevronDown,
  CircleHelp,
  FileCode2,
  KeyRound,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Send,
  Server,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TerminalSquare,
  Wrench,
  X,
} from 'lucide-react'

const navItems = [
  { label: 'Chat', icon: LayoutDashboard, active: true },
  { label: 'MCP servers', icon: Server, count: '3' },
  { label: 'AI providers', icon: KeyRound, count: '2' },
  { label: 'Agent settings', icon: SlidersHorizontal },
]

const tools = [
  { name: 'search_repositories', server: 'GitHub MCP', enabled: true, safe: true },
  { name: 'get_pull_request', server: 'GitHub MCP', enabled: true, safe: true },
  { name: 'create_issue', server: 'GitHub MCP', enabled: false, safe: false },
]

export function ControlCenter() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [isThinking, setIsThinking] = useState(false)

  async function submitPrompt() {
    const trimmed = prompt.trim()
    if (!trimmed || isThinking) return
    setMessages((items) => [...items, { role: 'user', text: trimmed }])
    setPrompt('')
    setIsThinking(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })
      const data = await response.json()
      setMessages((items) => [...items, { role: 'assistant', text: data.text ?? 'I could not complete that request.' }])
    } catch {
      setMessages((items) => [...items, { role: 'assistant', text: 'The agent is unavailable. Check your provider configuration and try again.' }])
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground lg:flex">
      <button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="fixed left-4 top-4 z-20 rounded-lg border border-border bg-card p-2 text-muted-foreground lg:hidden">
        <Menu className="size-4" />
      </button>
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-5 transition-transform lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="size-4" /></div>
            <span className="font-semibold tracking-tight">supix</span>
          </div>
          <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="text-muted-foreground lg:hidden"><X className="size-4" /></button>
        </div>
        <button className="mt-8 flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium shadow-sm"><span className="flex items-center gap-2"><Plus className="size-4 text-muted-foreground" /> New chat</span><span className="font-mono text-[10px] text-muted-foreground">⌘ K</span></button>
        <div className="mt-8 flex flex-col gap-1">
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
          {navItems.map(({ label, icon: Icon, count, active }) => <button key={label} className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm ${active ? 'bg-accent font-medium text-foreground' : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'}`}><span className="flex items-center gap-3"><Icon className="size-4" />{label}</span>{count && <span className="font-mono text-xs text-muted-foreground">{count}</span>}</button>)}
        </div>
        <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent"><Settings2 className="size-4" /> System settings</button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent"><CircleHelp className="size-4" /> Documentation</button>
          <div className="mt-3 flex items-center gap-3 rounded-lg bg-accent/60 p-2.5"><div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">JD</div><div className="min-w-0"><p className="truncate text-xs font-medium">Jordan Davis</p><p className="truncate text-[11px] text-muted-foreground">Local workspace</p></div></div>
        </div>
      </aside>
      {mobileOpen && <button aria-label="Close navigation overlay" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-20 bg-background/60 backdrop-blur-sm lg:hidden" />}

      <section className="flex min-h-screen min-w-0 flex-1 flex-col lg:max-w-[calc(100vw-256px)]">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5 pl-16 lg:px-8 lg:pl-8">
          <div><p className="text-sm font-semibold">Chat agent</p><p className="text-xs text-muted-foreground">Your AI workspace, connected to the tools you trust.</p></div>
          <div className="flex items-center gap-2"><span className="hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1.5 text-xs text-muted-foreground sm:flex"><span className="size-1.5 rounded-full bg-emerald-500" /> 3 MCP servers online</span><button className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-accent"><Search className="size-4" /></button></div>
        </header>
        <div className="flex min-h-0 flex-1">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-border px-5 py-3 lg:px-8"><button className="flex items-center gap-2 text-sm font-medium">Supix Agent <ChevronDown className="size-3.5 text-muted-foreground" /></button><div className="flex items-center gap-2"><span className="hidden text-xs text-muted-foreground sm:block">Using</span><button className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"><span className="size-1.5 rounded-full bg-primary" /> NVIDIA · Nemotron <ChevronDown className="size-3 text-muted-foreground" /></button></div></div>
            <div className="flex flex-1 flex-col justify-end overflow-auto px-5 py-8 lg:px-16">
              {messages.length === 0 ? <div className="mx-auto mb-auto flex max-w-xl flex-col items-center justify-center pt-16 text-center"><div className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm"><Bot className="size-6" /></div><h1 className="text-balance text-2xl font-semibold tracking-tight">What can I help you build?</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Ask Supix to reason across your connected models and MCP tools.</p><div className="mt-8 grid w-full gap-2 sm:grid-cols-2"><Suggestion icon={TerminalSquare} text="Find open issues in my repo" /><Suggestion icon={Wrench} text="Inspect my connected tools" /></div></div> : <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">{messages.map((message, index) => <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'border border-border bg-card'}`}>{message.text}</div></div>)}{isThinking && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Activity className="size-3.5 animate-pulse" /> Supix is working across your tools...</div>}</div>}
            </div>
            <div className="px-5 pb-5 lg:px-16 lg:pb-8"><div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-2 shadow-sm"><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); void submitPrompt() } }} placeholder="Message Supix..." className="min-h-12 w-full resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground" /><div className="flex items-center justify-between px-2"><span className="flex items-center gap-1.5 text-[11px] text-muted-foreground"><ShieldCheck className="size-3.5" /> Secure by design</span><button aria-label="Send message" onClick={() => void submitPrompt()} disabled={!prompt.trim() || isThinking} className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"><Send className="size-3.5" /></button></div></div><p className="mt-2 text-center text-[10px] text-muted-foreground">Supix can make mistakes. Review tool actions before they run.</p></div>
          </div>
          <aside className="hidden w-72 shrink-0 border-l border-border xl:block"><div className="border-b border-border px-5 py-4"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">MCP activity</p><button className="text-muted-foreground"><Settings2 className="size-4" /></button></div></div><div className="flex flex-col gap-5 p-5"><div className="rounded-lg border border-border bg-card p-3"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500" /><span className="text-sm font-medium">GitHub MCP</span><span className="ml-auto text-[10px] text-muted-foreground">12 tools</span></div><p className="mt-2 text-xs leading-5 text-muted-foreground">Ready to search repos, inspect issues, and review pull requests.</p></div><div><div className="mb-3 flex items-center justify-between"><p className="text-xs font-medium">Allowed tools</p><span className="text-[10px] text-muted-foreground">2 of 3 enabled</span></div><div className="flex flex-col gap-2">{tools.map((tool) => <div key={tool.name} className="flex items-center gap-2 rounded-md px-1 py-1"><div className={`flex size-6 items-center justify-center rounded-md ${tool.enabled ? 'bg-accent text-foreground' : 'bg-muted text-muted-foreground'}`}><Wrench className="size-3" /></div><div className="min-w-0 flex-1"><p className="truncate font-mono text-[10px]">{tool.name}</p><p className="text-[10px] text-muted-foreground">{tool.safe ? 'Read only' : 'Requires approval'}</p></div><div className={`size-1.5 rounded-full ${tool.enabled ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} /></div>)}</div></div><div className="rounded-lg bg-accent/60 p-3"><div className="flex items-center gap-2 text-xs font-medium"><ShieldCheck className="size-3.5" /> Permission policy</div><p className="mt-2 text-[11px] leading-5 text-muted-foreground">Destructive actions are disabled by default and always require your approval.</p><button className="mt-3 text-[11px] font-medium underline underline-offset-4">Review policy</button></div></div></aside>
        </div>
      </section>
    </main>
  )
}

function Suggestion({ icon: Icon, text }: { icon: typeof TerminalSquare; text: string }) { return <button onClick={() => {}} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left text-xs text-muted-foreground hover:bg-accent hover:text-foreground"><Icon className="size-4 shrink-0" />{text}</button> }
