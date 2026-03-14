import { Metadata } from 'next'
import ProgressoClient from './progresso-client'

export const metadata: Metadata = {
  title: 'Progresso | SNAE',
  description: 'Acompanhe seu progresso acadêmico e conquistas'
}

export default function ProgressoPage() {
  return <ProgressoClient />
}