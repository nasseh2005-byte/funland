# Asset provenance — current design

The current interface uses an original island illustration and three licensed illustrative photographs. None depict the actual Fun Island venue. They are labeled in the interface and should be replaced by approved venue photography when available.

| Local asset | Photographer / source | License |
| --- | --- | --- |
| `public/images/carousel.webp` | [Andy Watkins, Unsplash](https://unsplash.com/photos/blue-and-brown-carousel-with-lights-C9p665IjD9Y) | [Unsplash license](https://unsplash.com/license) |
| `public/images/bumper-cars.webp` | [Damir K, Pexels](https://www.pexels.com/photo/bumper-cars-in-amusement-park-17503947/) | [Pexels license](https://www.pexels.com/license/) |
| `public/images/arcade.webp` | [Lucas Andrade, Pexels](https://www.pexels.com/photo/arcade-machines-in-an-arcade-25798272/) | [Pexels license](https://www.pexels.com/license/) |

The photographs were downloaded from the verified provider image URLs and resized to WebP for this website. No endorsement is implied.

`public/images/island-beach.webp` was created with the built-in image generation tool. Prompt: landscape top-down/oblique illustrated sandy island edged with a narrow turquoise sea and white surf, green palm trees framing both sides, three grassy clearings connected by golden sand paths, small carousel, bumper-car track and arcade pavilion; sunny beach mood with yellow umbrellas. Editorial gouache / screen-print style, subtle paper grain, simplified shapes and irregular brushwork. Dominant golden sand and leafy greens with orange accents. Cream background. No text, logos, glossy 3D, plastic render, floating rocks, pirates or treasure. Conceptual wayfinding map, not a real venue floor plan.

`public/images/island-night.webp` is a nighttime edit of the same island, generated with the built-in image tool. The brief preserves the exact camera, geometry, coastline, trees, rides, pavilion and paths; changes lighting to midnight teal water, desaturated foliage, moonlit sand and amber carousel, pavilion and path lights; retains the gouache texture and excludes text, people, moon and UI. The separate interface moon uses the existing icon system. Both images share a 1600 × 914 canvas for continuous day/night camera alignment.

Fonts: Alexandria for body text, Baloo Bhaijaan 2 for display headings, loaded through Google Fonts. The interface mark is an original Ferris-wheel icon treatment, not an official supplied logo.

## Generated game-card images

Created using the built-in `image_gen` tool, exported to 1100 × 733 WebP. Both are conceptual AI imagery, labeled in game cards and island details; neither depicts the actual venue.

- `public/images/train-ai.webp`
- `public/images/jump-ai.webp`

Train prompt:
```text
Use case: photorealistic-natural
Asset type: amusement website ride card, conceptual AI image (not an actual venue photograph)
Primary request: landscape 3:2 editorial photo-style image of a cheerful small children's amusement park train.
Scene/backdrop: palms and a neat garden in late afternoon warm sunlight.
Subject: golden yellow locomotive with deep green detailing and orange carriages rounding a low track. Ride entirely empty.
Style/medium: realistic editorial photography, natural materials and believable scale.
Composition/framing: entire main subject centered and comfortably within the frame, safe for a centered 5:3 card crop; landscape 3:2.
Lighting/mood: warm late afternoon sunlight, cheerful and inviting.
Constraints: no people, no text, no logo, no watermark. Generate exactly one image.
```

Jump prompt:
```text
Use case: photorealistic-natural
Asset type: amusement website ride card, conceptual AI image (not an actual venue photograph)
Primary request: landscape 3:2 editorial photo-style image of a colorful indoor trampoline/activity play area.
Subject: golden yellow, leaf green and orange padded borders, black jumping mats and visible safety nets.
Style/medium: realistic editorial photography with believable padded surfaces and lively geometry.
Composition/framing: broad view of the main play area centered and comfortably within the frame, safe for a centered 5:3 card crop; landscape 3:2.
Lighting/mood: tasteful bright warm lighting, colorful and inviting.
Constraints: no people, no text, no logos, no watermarks. Generate exactly one image.
```

## Superseded concept (not used in current pages)

Asset: `public/images/island-concept.webp`.

Created specifically for this project with the built-in image generation tool. This is conceptual artwork and is labeled accordingly on the website. It must not be described as a photograph, actual floor plan, or evidence that the illustrated rides exist at the venue.

Prompt: Premium stylized 3D architectural model of an abstract family amusement island for Saudi Fun Island. Rich deep royal blue seamless studio background; sculptural grass-green island, cream walking paths, elegant yellow Ferris wheel focal point, small blue-and-yellow carousel and track rides, tasteful rounded architecture and abstract rounded trees. High-end clay/plastic architectural visualization, square isometric aerial three-quarter view, complete model visible with blue space at all edges, soft studio sunlight and gentle shadows. Mostly blue, warm yellow and grass green. No people, palm trees, pirates, treasure, text, logos or watermark.

The previous blue 3D illustration is retained as a superseded source asset, not used by current pages. No unverified customer reviews are used.
