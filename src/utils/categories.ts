import type { ServiceCategory } from '@/types'

export const CATEGORIES: { value: ServiceCategory; label: string; icon: string }[] = [
  { value: 'plomeria', label: 'Plomería', icon: 'pi-wrench' },
  { value: 'electricidad', label: 'Electricidad', icon: 'pi-bolt' },
  { value: 'carpinteria', label: 'Carpintería', icon: 'pi-objects-column' },
  { value: 'pintura', label: 'Pintura', icon: 'pi-palette' },
  { value: 'albanileria', label: 'Albañilería', icon: 'pi-building' },
  { value: 'tecnologia', label: 'Tecnología', icon: 'pi-desktop' },
  { value: 'limpieza', label: 'Limpieza', icon: 'pi-sparkles' },
  { value: 'cerrajeria', label: 'Cerrajería', icon: 'pi-key' },
  { value: 'reparaciones_generales', label: 'Reparaciones generales', icon: 'pi-hammer' },
  { value: 'otro', label: 'Otro', icon: 'pi-plus-circle' },
]

export function getCategoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}
