import './PaintsList.css';
import PaintCard from '../PaintCard/PaintCard';
import { type Paint } from '../../modules/PaintsTypes';

export default function PaintsList({ paints }: {paints: Paint[]}) {
  return (
    <div className="grid-list">
      {paints.map((s) => (
        <PaintCard key={s.id} paint={s} />  
      ))}
    </div>
  );
}