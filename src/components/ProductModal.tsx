import { useEffect, useId, useRef, useState } from 'react';
import type { Product } from '../types';
import { asset } from '../utils/assets';
import { money } from '../utils/format';
import ProductImage from './ProductImage';

interface Props {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

function isOutsideDialog(event: { clientX: number; clientY: number }, dialog: HTMLDialogElement) {
  const bounds = dialog.getBoundingClientRect();
  return event.clientX < bounds.left || event.clientX > bounds.right ||
    event.clientY < bounds.top || event.clientY > bounds.bottom;
}

export default function ProductModal({ product, onClose, onAddToCart }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pointerStartedOutside = useRef(false);
  const titleId = useId();
  const descriptionId = useId();
  const detailsId = useId();
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      const currentPadding = parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  const addToCart = () => {
    onAddToCart(product, quantity);
    setStatus(`${quantity} ${quantity === 1 ? 'unidade adicionada' : 'unidades adicionadas'} ao carrinho.`);
  };

  return (
    <dialog
      ref={dialogRef}
      className="product-modal"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]',
        )).filter((element) => element.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onPointerDown={(event) => {
        pointerStartedOutside.current = event.target === event.currentTarget &&
          isOutsideDialog(event, event.currentTarget);
      }}
      onClick={(event) => {
        if (pointerStartedOutside.current && event.target === event.currentTarget &&
          isOutsideDialog(event, event.currentTarget)) onClose();
        pointerStartedOutside.current = false;
      }}
    >
      <button
        ref={closeButtonRef}
        className="product-modal__close"
        type="button"
        aria-label="Fechar detalhes do produto"
        onClick={onClose}
      >
        <img className="product-modal__close-line product-modal__close-line--first" src={asset('popup-Line13.svg')} alt="" />
        <img className="product-modal__close-line product-modal__close-line--second" src={asset('popup-Line14.svg')} alt="" />
      </button>

      <div className="product-modal__image">
        <ProductImage product={product} loading="eager" />
      </div>

      <div className="product-modal__info">
        <h2 id={titleId} className="product-modal__title">{product.productName}</h2>
        <p className="product-modal__price">{money(product.price)}</p>
        <p id={descriptionId} className="product-modal__description">{product.descriptionShort}</p>
        <button
          className="product-modal__details-button"
          type="button"
          aria-expanded={showDetails}
          aria-controls={detailsId}
          onClick={() => setShowDetails((visible) => !visible)}
        >
          {showDetails ? 'Ocultar detalhes do produto' : 'Veja mais detalhes do produto >'}
        </button>

        <dl id={detailsId} className="product-modal__details" hidden={!showDetails}>
          <dt>Produto</dt>
          <dd>{product.productName}</dd>
          <dt>Descrição</dt>
          <dd>{product.descriptionShort}</dd>
        </dl>

        <div className="product-modal__actions">
          <div className="product-modal__quantity" role="group" aria-label="Quantidade do produto">
            <button
              type="button"
              aria-label="Diminuir quantidade"
              disabled={quantity === 1}
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            >
              <img src={asset('popup-Minus.svg')} alt="" />
            </button>
            <output aria-label="Quantidade" aria-live="polite">{String(quantity).padStart(2, '0')}</output>
            <button
              type="button"
              aria-label="Aumentar quantidade"
              onClick={() => setQuantity((value) => value + 1)}
            >
              <img src={asset('popup-Plus.svg')} alt="" />
            </button>
          </div>
          <button className="product-modal__buy" type="button" onClick={addToCart}>COMPRAR</button>
        </div>
        <p className={`product-modal__status${status ? '' : ' product-modal__status--empty'}`} role="status" aria-live="polite">{status}</p>
      </div>
    </dialog>
  );
}
