import { Star } from 'lucide-react';
export default function Stars({ value = 0, interactive = false, onChange }) {
  return <span className="stars" role={interactive ? 'radiogroup' : undefined} aria-label={`Avaliação: ${value} de 5 estrelas`}>
    {Array.from({ length: 5 }, (_, i) => interactive
      ? <button key={i} type="button" className="star-button" role="radio" aria-checked={value === i + 1} aria-label={`${i + 1} estrela${i ? 's' : ''}`} onClick={() => onChange(i + 1)}><Star size={25} fill={i < value ? 'currentColor' : 'none'}/></button>
      : <Star key={i} size={17} fill={i < value ? 'currentColor' : 'none'} aria-hidden="true" />)}
  </span>;
}
