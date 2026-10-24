/**
 * Middle-dot separator, as in "Quick · Clean · Kind". The font's dot sits off-center,
 * so it gets a little extra room on the right. Hidden from screen readers.
 */
export function Sep() {
  return (
    <>
      {" "}
      <span aria-hidden="true" className="pr-[0.22em]">
        ·
      </span>{" "}
    </>
  );
}
