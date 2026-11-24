'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import CuentaMenu from '@/components/CuentaMenu'
export default function AdminLayout({children}:{children:React.ReactNode}){
  const router=useRouter();const path=usePathname();const[user,setUser]=useState<any>(null)
  useEffect(()=>{fetch('/api/auth/session').then(r=>r.json()).then(d=>{if(!d.user||!d.user.empresa_id){router.push('/');return};setUser(d.user)})},[])
  async function logout(){await fetch('/api/auth/logout',{method:'POST'});router.push('/')}
  return(
    <div style={{height:'100vh',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'7px 18px',background:'var(--bg-panel)',borderBottom:'1px solid var(--border)',flexShrink:0}}>
        <button className="btn btn-sec" style={{fontSize:10,padding:'3px 9px'}} onClick={()=>router.push('/modulos')}>← Módulos</button>
        <div style={{fontSize:17,fontWeight:700,letterSpacing:2,marginLeft:8}}>PRE<span style={{color:'var(--accent)'}}>DA</span></div>
        <span style={{padding:'2px 9px',borderRadius:20,fontSize:10,fontWeight:600,background:'rgba(232,160,32,.15)',color:'var(--warn)'}}>ADMINISTRACIÓN</span>
        <div style={{flex:1}}/>
        <span style={{fontSize:12,fontWeight:600}}>{user?.nombre}</span>
        <CuentaMenu/>
        <button className="btn btn-sec" style={{fontSize:11,padding:'4px 9px'}} onClick={logout}>Salir</button>
      </div>
      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
        <div style={{width:180,flexShrink:0,background:'var(--bg-panel)',borderRight:'1px solid var(--border)',padding:6}}>
          {[{href:'/administracion/config',l:'Configuración',e:'⚙️'},{href:'/administracion/usuarios',l:'Usuarios',e:'👑'}].map(it=>(
            <button key={it.href} onClick={()=>router.push(it.href)} style={{display:'flex',alignItems:'center',gap:7,padding:'8px 9px',borderRadius:7,width:'100%',textAlign:'left',background:path===it.href?'rgba(232,160,32,.1)':'transparent',color:path===it.href?'var(--warn)':'var(--text-2)',border:'none',borderLeft:path===it.href?'2px solid var(--warn)':'2px solid transparent',cursor:'pointer',fontFamily:'var(--font)',fontSize:12,fontWeight:path===it.href?600:400}}>
              <span style={{width:16,textAlign:'center'}}>{it.e}</span>{it.l}
            </button>
          ))}
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>{children}</div>
      </div>
    </div>
  )
}
