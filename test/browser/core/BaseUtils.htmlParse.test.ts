// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { htmlToElement, htmlToElements, htmlToFragment, DOMPurifyNexus } from '../../../core/BaseUtils';

// Mock DOMPurifyNexus for predictable sanitization
describe('htmlToElement', () => {
  it('parses a single element', () => {
    const el = htmlToElement('<button>Click me</button>');
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.tagName).toBe('BUTTON');
    expect(el.textContent).toBe('Click me');
  });

  it('sanitizes by default (removes script)', () => {
    const el = htmlToElement('<div>Safe<script>alert(1)</script></div>');
    expect(el.tagName).toBe('DIV');
    expect(el.innerHTML).not.toContain('script');
    expect(el.textContent).toBe('Safe');
  });

  it('can disable sanitization', () => {
    const el = htmlToElement('<div onclick="alert(1)">Unsafe</div>', { disableSanitize: true });
    expect(el.getAttribute('onclick')).toBe('alert(1)');
  });
});

describe('htmlToElements', () => {
  it('parses multiple sibling elements', () => {
    const els = htmlToElements('<div>One</div><div>Two</div>');
    expect(Array.isArray(els)).toBe(true);
    expect(els.length).toBe(2);
    expect(els[0].tagName).toBe('DIV');
    expect(els[0].textContent).toBe('One');
    expect(els[1].textContent).toBe('Two');
  });

  it('sanitizes by default (removes script)', () => {
    const els = htmlToElements('<div>Safe</div><script>alert(1)</script>');
    expect(els.length).toBe(1);
    expect(els[0].tagName).toBe('DIV');
    expect(els[0].textContent).toBe('Safe');
  });

  it('can disable sanitization', () => {
    const els = htmlToElements('<div onclick="alert(1)">Unsafe</div>', { disableSanitize: true });
    expect(els[0].getAttribute('onclick')).toBe('alert(1)');
  });
});

describe('htmlToFragment', () => {
  it('parses multiple nodes into a DocumentFragment', () => {
    const fragment = htmlToFragment('<div>One</div><div>Two</div>');
    expect(fragment).toBeInstanceOf(DocumentFragment);
    const children = Array.from(fragment.childNodes);
    expect(children.length).toBe(2);
    expect((children[0] as HTMLElement).textContent).toBe('One');
    expect((children[1] as HTMLElement).textContent).toBe('Two');
  });

  it('includes text nodes', () => {
    const fragment = htmlToFragment('Hello <b>World</b>!');
    const children = Array.from(fragment.childNodes);
    expect(children[0].nodeType).toBe(Node.TEXT_NODE);
    expect(children[1].nodeType).toBe(Node.ELEMENT_NODE);
    expect(children[2].nodeType).toBe(Node.TEXT_NODE);
    expect(children[0].textContent).toContain('Hello');
    expect((children[1] as HTMLElement).tagName).toBe('B');
    expect(children[2].textContent).toContain('!');
  });

  it('can disable sanitization', () => {
    const fragment = htmlToFragment('<div onclick="alert(1)">Unsafe</div>', { disableSanitize: true });
    const div = fragment.firstElementChild as HTMLElement;
    expect(div.getAttribute('onclick')).toBe('alert(1)');
  });
});