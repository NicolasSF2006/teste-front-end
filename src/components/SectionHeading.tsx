interface Props { id: string; children: string; lines?: boolean; }
export default function SectionHeading({ id, children, lines = true }: Props) {
  return <div className={`section-heading ${lines ? '' : 'section-heading--plain'}`}>
    <h2 id={id}>{children}</h2>
  </div>;
}
