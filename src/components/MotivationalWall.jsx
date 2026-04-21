import NeonTypeLine from './NeonTypeLine'

const phrases = [
  'Entrena a conciencia',
  'Cuida tu alimentación',
  'Asesórate por los mejores',
  'Entrena con nosotros',
]

export default function MotivationalWall() {
  return (
    <div className="hidden xl:flex flex-col items-start gap-6 pl-10 border-l border-white/5">
      {phrases.map((text, i) => (
        <div key={text} className="w-full">
          <NeonTypeLine text={text} startDelay={900 + i * 240} speedMs={26} />
        </div>
      ))}
    </div>
  )
}

