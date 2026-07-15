# Components Directory

Store reusable Astro components and React components here.

## Astro Components
Create `.astro` files for pure HTML/CSS components:
```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="component">
  <h2>{title}</h2>
  <slot />
</div>

<style>
  .component {
    /* Scoped styles */
  }
</style>
```

## React Components
Create `.jsx` files for interactive components:
```jsx
export default function MyComponent() {
  return <div>Interactive Component</div>;
}
```

Then use in pages with `client:load` directive:
```astro
---
import MyComponent from '../components/MyComponent.jsx';
---

<MyComponent client:load />
```

## Component Organization
- Keep components small and focused
- Use descriptive names
- Document props and usage
- Prefer Astro components for static content
- Use React only for interactivity
