import { describe, expect, test } from 'vitest'
import { configuredXss, md, renderString } from './parse'

describe('configuredXss', () => {
  test('should neutralize <script> tag between <p> tags', () => {
    const input = '<p>hello</p><script>alert("hello")</script><p>world</p>'
    // Escapes the brackets on the script tag, but not the paragraphs
    expect(configuredXss.process(input)).toBe(
      '<p>hello</p>&lt;script&gt;alert("hello")&lt;/script&gt;<p>world</p>',
    )
  })

  test('should neutralize <script> tags inside other tags', () => {
    const input = '<p>hello<script>alert("hello")</script>world</p>'
    // Escapes the brackets on the script tag, but not the paragraph
    expect(configuredXss.process(input)).toBe(
      '<p>hello&lt;script&gt;alert("hello")&lt;/script&gt;world</p>',
    )
  })

  test('should neutralize <script> tags inside other tags', () => {
    const input = '<p>hello<script>alert("hello")</script>world</p>'
    // Escapes the brackets on the script tag, but not the paragraph
    expect(configuredXss.process(input)).toBe(
      '<p>hello&lt;script&gt;alert("hello")&lt;/script&gt;world</p>',
    )
  })

  test('should remove unexpected "onerror" attribute on <img> tag', () => {
    const input = '<img onerror="alert(1)" />'
    expect(configuredXss.process(input)).toBe('<img />')
  })

  test('should remove unexpected "display" style on <img> tag', () => {
    const input = '<img style="display: none; float: right;" />'
    expect(configuredXss.process(input)).toBe('<img style="float:right;" />')
  })

  test('should remove unexpected "float" style value on <img> tag', () => {
    const input = '<img style="float: frog;" />'
    expect(configuredXss.process(input)).toBe('<img style />')
  })

  test('should allow iframe from "youtube-nocookie.com"', () => {
    const input = '<iframe src="https://www.youtube-nocookie.com/embed/0MUsVcYhERY" />'
    expect(configuredXss.process(input)).toBe(input)
  })

  // TODO: Uncomment once it works...
  // test('should allow iframe from "youtube-nocookie.com" with start parameter', () => {
  //   const input = '<iframe src="https://www.youtube-nocookie.com/embed/0MUsVcYhERY?start=2" />'
  //   expect(configuredXss.process(input)).toBe(input)
  // })

  test('should remove unexpected query parameter from iframe from "youtube-nocookie.com"', () => {
    const input = '<iframe src="https://www.youtube-nocookie.com/embed/0MUsVcYhERY?grr=frog" />'
    expect(configuredXss.process(input)).toBe(input.replace('?grr=frog', ''))
  })

  test('should remove iframe from "modrinth.com"', () => {
    const input = '<iframe src="https://modrinth.com/settings/pats" />'
    expect(configuredXss.process(input)).toBe('<iframe />')
  })

  test('should permit images from "github.com"', () => {
    const input = '<img src="https://github.com/modrinth.png" />'
    expect(configuredXss.process(input)).toBe(input)
  })

  test('should remove "errorredirect" attribute from wsrv.nl image links', () => {
    const input =
      '<img src="https://wsrv.nl/?url=https%3A%2F%2Fexample.com&errorredirect=https%3A%2F%2Fmodrinth.com" />'
    expect(configuredXss.process(input)).toBe(
      '<img src="https://wsrv.nl/?url=https%3A%2F%2Fexample.com" />',
    )
  })

  test('should wrap image link from "example.com" with wsrv.nl', () => {
    const input = '<img src="https://example.com/image.png" />'
    expect(configuredXss.process(input)).toBe(
      '<img src="https://wsrv.nl/?url=https%3A%2F%2Fexample.com%2Fimage.png&n=-1" />',
    )
  })
})

describe('markdown configuration', () => {
  test('should add rel attributes to links', () => {
    expect(md().render('[my link](https://example.com)')).toBe(
      '<p><a href="https://example.com" rel="noopener nofollow ugc">my link</a></p>\n',
    )
  })

  test('should not add rel attributes to modrinth.com links', () => {
    expect(md().render('[my link](https://modrinth.com)')).toBe(
      '<p><a href="https://modrinth.com">my link</a></p>\n',
    )
  })

  test('should automatically link plaintext links', () => {
    expect(md().render('https://modrinth.com')).toBe(
      '<p><a href="https://modrinth.com">https://modrinth.com</a></p>\n',
    )
  })
})

describe('renderString', () => {
  test('should combine markdown parser and XSS prevention', () => {
    expect(renderString('# Hello world\n<script>alert(1)</script>')).toBe(
      '<h1>Hello world</h1>\n&lt;script&gt;alert(1)&lt;/script&gt;',
    )
  })
})
