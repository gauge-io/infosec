import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { SectionHeader } from '../components/design-system/SectionHeader';
import { FeatureCard } from '../components/design-system/FeatureCard';
import { StatusBadge } from '../components/design-system/StatusBadge';
import { Zap, Shield, Database, ArrowRight, Link as LinkIcon, Check, X, AlertCircle } from 'lucide-react';

export function DesignSystem() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24 space-y-24">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-serif font-bold tracking-tight">Design System</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A collection of design tokens, reusable components, and guidelines for building consistent user interfaces.
          </p>
        </div>

        {/* Colors */}
        <section className="space-y-8">
          <SectionHeader 
            title="Colors" 
            subtitle="Our color palette is designed to be accessible and consistent across dark mode interfaces."
            eyebrow="Tokens"
            align="left"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">Semantic Colors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ColorSwatch name="Primary" variable="var(--primary)" />
                <ColorSwatch name="Secondary" variable="var(--secondary)" />
                <ColorSwatch name="Destructive" variable="var(--destructive)" />
                <ColorSwatch name="Muted" variable="var(--muted)" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">Status Colors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ColorSwatch name="Success" variable="var(--success)" />
                <ColorSwatch name="Warning" variable="var(--warning)" />
                <ColorSwatch name="Info" variable="var(--info)" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">Gauge Brand Colors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ColorSwatch name="Salmon" color="#FF6B6B" />
                <ColorSwatch name="Fuscia" color="#FF6B8A" />
                <ColorSwatch name="Mango (Primary)" color="#D99A3D" highlight />
                <ColorSwatch name="Purple" color="#6B5B95" />
                <ColorSwatch name="Blue" color="#66ccff" />
              </div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Mango</strong> (#D99A3D) is the primary color for links, buttons, and active states. Links use tint variation on hover (no underline).
              </p>
            </div>

             <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">Surfaces</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ColorSwatch name="Background" variable="var(--background)" border />
                <ColorSwatch name="Card" variable="var(--card)" border />
                <ColorSwatch name="Popover" variable="var(--popover)" border />
                <ColorSwatch name="Border" variable="var(--border)" />
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-8">
          <SectionHeader 
            title="Typography" 
            subtitle="We use IBM Plex Serif for headings, IBM Plex Sans for UI text and body content, and IBM Plex Mono for code and technical details."
            eyebrow="Tokens"
            align="left"
          />

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-muted-foreground font-mono mb-2 block">font-serif (IBM Plex Serif)</span>
                  <h1 className="text-5xl font-serif font-bold">Heading 1</h1>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-mono mb-2 block">font-serif (IBM Plex Serif)</span>
                  <h2 className="text-4xl font-serif font-semibold">Heading 2</h2>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-mono mb-2 block">font-serif (IBM Plex Serif)</span>
                  <h3 className="text-3xl font-serif font-semibold">Heading 3</h3>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground font-mono mb-2 block">font-serif (IBM Plex Serif)</span>
                  <h4 className="text-2xl font-serif font-semibold">Heading 4</h4>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">
                <span className="text-muted-foreground text-sm block mb-2 font-mono">Body Large (font-sans)</span>
                The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.
              </p>
              <p className="text-base leading-relaxed">
                <span className="text-muted-foreground text-sm block mb-2 font-mono">Body Base (font-sans)</span>
                The quick brown fox jumps over the lazy dog. Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed.
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="text-muted-foreground text-xs block mb-2 font-mono">Body Small (Muted)</span>
                The quick brown fox jumps over the lazy dog. Use this for secondary text, captions, and less important information.
              </p>
              <div className="font-mono p-4 bg-muted rounded-lg">
                 <span className="text-muted-foreground text-xs block mb-2 font-sans">Monospace (IBM Plex Mono)</span>
                const designSystem = "awesome";
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4 pt-8 border-t">
            <h3 className="text-xl font-serif font-semibold">Links</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Default Link (Mango)</p>
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">Primary link color - tint on hover</a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Link in Context</p>
                <p className="text-foreground">
                  This is a paragraph with a <a href="#" className="text-primary hover:text-primary/80 transition-colors">link that uses Mango</a> for emphasis and interaction. Hover to see tint variation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing & Layout */}
        <section className="space-y-8">
          <SectionHeader 
            title="Spacing & Layout" 
            subtitle="Consistent spacing creates visual rhythm and hierarchy. Based on a 4px base unit."
            eyebrow="Tokens"
            align="left"
          />

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">Spacing Scale</h3>
              <div className="space-y-3">
                {[0, 1, 2, 3, 4, 6, 8, 12, 16, 24].map((size) => (
                  <div key={size} className="flex items-center gap-4">
                    <code className="text-xs text-muted-foreground font-mono w-16">{size === 0 ? '0' : `${size * 0.25}rem`}</code>
                    <div className="flex-1 flex items-center gap-2">
                      <div 
                        className="bg-primary/20 h-4 rounded"
                        style={{ width: size === 0 ? '4px' : `${size * 4}px` }}
                      />
                      <span className="text-sm text-muted-foreground">spacing-{size}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">Border Radius</h3>
              <div className="space-y-3">
                {[
                  { name: 'none', value: '0', example: '0px' },
                  { name: 'sm', value: '0.125rem', example: '2px' },
                  { name: 'md', value: '0.375rem', example: '6px' },
                  { name: 'lg', value: '0.5rem', example: '8px' },
                  { name: 'xl', value: '0.75rem', example: '12px' },
                  { name: '2xl', value: '1rem', example: '16px' },
                  { name: 'full', value: '9999px', example: 'Pill' },
                ].map((radius) => (
                  <div key={radius.name} className="flex items-center gap-4">
                    <code className="text-xs text-muted-foreground font-mono w-24">{radius.value}</code>
                    <div 
                      className="w-16 h-16 bg-primary/20 border border-primary/40"
                      style={{ borderRadius: radius.value === '9999px' ? '9999px' : radius.value }}
                    />
                    <span className="text-sm text-muted-foreground">rounded-{radius.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-semibold">Breakpoints</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: 'sm', value: '640px' },
                { name: 'md', value: '768px' },
                { name: 'lg', value: '1024px' },
                { name: 'xl', value: '1280px' },
                { name: '2xl', value: '1536px' },
              ].map((bp) => (
                <div key={bp.name} className="p-4 border rounded-lg bg-card">
                  <div className="font-mono text-sm font-semibold text-foreground mb-1">{bp.name}</div>
                  <div className="text-xs text-muted-foreground">{bp.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Shadows & Elevation */}
        <section className="space-y-8">
          <SectionHeader 
            title="Shadows & Elevation" 
            subtitle="Subtle shadows and glows create depth in dark mode interfaces."
            eyebrow="Tokens"
            align="left"
          />

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg bg-card">
              <div className="text-sm font-semibold mb-2">Standard Shadow</div>
              <div className="h-24 bg-muted rounded-lg shadow-sm flex items-center justify-center text-muted-foreground text-xs">
                shadow-sm
              </div>
            </div>
            <div className="p-6 border rounded-lg bg-card">
              <div className="text-sm font-semibold mb-2">Card Shadow</div>
              <div className="h-24 bg-muted rounded-lg shadow-md flex items-center justify-center text-muted-foreground text-xs">
                shadow-md
              </div>
            </div>
            <div className="p-6 border rounded-lg bg-card">
              <div className="text-sm font-semibold mb-2">Glow Effect</div>
              <div className="h-24 bg-muted rounded-lg shadow-glow flex items-center justify-center text-muted-foreground text-xs">
                shadow-glow
              </div>
            </div>
          </div>
        </section>

        {/* Base Components */}
        <section className="space-y-8">
          <SectionHeader 
            title="Base Components" 
            subtitle="Core interactive elements used throughout the application."
            eyebrow="Components"
            align="left"
          />

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">Buttons</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Variants</p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button>Default Button</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link Button</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Sizes</p>
                  <div className="flex flex-wrap gap-4 items-center">
                     <Button size="sm">Small</Button>
                     <Button size="default">Default</Button>
                     <Button size="lg">Large</Button>
                     <Button size="icon"><Zap size={16} /></Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Active State (Mango)</p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <button className="px-4 py-2 bg-mango hover:bg-mango/90 text-white font-medium rounded-lg transition-colors">
                      Active Button
                    </button>
                    <button className="px-4 py-2 border-2 border-mango text-mango hover:bg-mango/10 font-medium rounded-lg transition-colors">
                      Active Outline
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-3">States</p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button disabled>Disabled</Button>
                    <Button className="opacity-50 cursor-not-allowed">Loading...</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">Cards</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                    <CardDescription>Card description goes here.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    Card content area.
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Action</Button>
                  </CardFooter>
                </Card>
                
                <Card className="border-mango/50 shadow-glow">
                  <CardHeader>
                    <CardTitle>Active/Glow Card</CardTitle>
                    <CardDescription>With active border and glow effect.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    Used for highlighting featured content.
                  </CardContent>
                </Card>

                 <Card className="bg-muted/50 border-none">
                  <CardHeader>
                    <CardTitle>Muted Card</CardTitle>
                    <CardDescription>For secondary content blocks.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    Blends more into the background.
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold">Form Elements</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Input Field</label>
                    <input 
                      type="text" 
                      placeholder="Enter text..."
                      className="w-full px-4 py-2 bg-muted border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Input with Active Focus</label>
                    <input 
                      type="text" 
                      placeholder="Focus to see active color..."
                      className="w-full px-4 py-2 bg-muted border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-mango focus:border-mango"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Textarea</label>
                    <textarea 
                      placeholder="Enter longer text..."
                      rows={3}
                      className="w-full px-4 py-2 bg-muted border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select</label>
                    <select className="w-full px-4 py-2 bg-muted border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>Option 1</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-input text-mango focus:ring-mango" />
                      <span className="text-sm">Checkbox option</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="radio" className="w-4 h-4 text-mango focus:ring-mango" />
                      <span className="text-sm">Radio option 1</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                      <input type="radio" name="radio" className="w-4 h-4 text-mango focus:ring-mango" />
                      <span className="text-sm">Radio option 2</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Extended Components */}
        <section className="space-y-8">
          <SectionHeader 
            title="Extended Library" 
            subtitle="Higher-level components built by composing base elements."
            eyebrow="Library"
            align="left"
          />

          <div className="space-y-12">
            {/* Section Headers */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold border-b pb-2">Section Headers</h3>
              <div className="space-y-8 p-6 border rounded-lg bg-card/50">
                <SectionHeader 
                  title="Center Aligned" 
                  subtitle="This is the default configuration for section headers."
                  eyebrow="Example"
                />
                <SectionHeader 
                  title="Left Aligned" 
                  subtitle="Useful for content-heavy sections or distinct blocks."
                  eyebrow="Alternative"
                  align="left"
                />
              </div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold border-b pb-2">Feature Cards</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <FeatureCard 
                  title="Secure by Design"
                  description="Security is integrated into every phase of our development process, ensuring robust protection."
                  icon={Shield}
                />
                <FeatureCard 
                  title="High Performance"
                  description="Optimized for speed and efficiency, our solutions scale with your business needs."
                  icon={Zap}
                  action={<Button variant="link" className="px-0 text-mango hover:text-mango/80">Learn more <ArrowRight className="ml-2 w-4 h-4" /></Button>}
                />
                 <FeatureCard 
                  title="Data Driven"
                  description="Make informed decisions with our comprehensive data analytics and reporting tools."
                  icon={Database}
                />
              </div>
            </div>

            {/* Status Badges */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold border-b pb-2">Status Badges</h3>
              <div className="flex flex-wrap gap-4 p-6 border rounded-lg bg-card/50">
                <StatusBadge variant="default">Default</StatusBadge>
                <StatusBadge variant="secondary">Secondary</StatusBadge>
                <StatusBadge variant="outline">Outline</StatusBadge>
                <StatusBadge variant="success">Success</StatusBadge>
                <StatusBadge variant="warning">Warning</StatusBadge>
                <StatusBadge variant="error">Error</StatusBadge>
                <StatusBadge variant="info">Info</StatusBadge>
              </div>
            </div>

            {/* Icons */}
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold border-b pb-2">Icons</h3>
              <div className="p-6 border rounded-lg bg-card/50">
                <p className="text-sm text-muted-foreground mb-4">
                  Icons from Lucide React. Default size is 16px (1rem). Use semantic sizes for consistency.
                </p>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    <span className="text-xs text-muted-foreground">w-6 h-6</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Shield className="w-5 h-5 text-mango" />
                    <span className="text-xs text-muted-foreground">w-5 h-5</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Database className="w-4 h-4 text-foreground" />
                    <span className="text-xs text-muted-foreground">w-4 h-4</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">w-4 h-4</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Check className="w-5 h-5 text-success" />
                    <span className="text-xs text-muted-foreground">w-5 h-5</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <X className="w-5 h-5 text-destructive" />
                    <span className="text-xs text-muted-foreground">w-5 h-5</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    <span className="text-xs text-muted-foreground">w-5 h-5</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-mango" />
                    <span className="text-xs text-muted-foreground">w-4 h-4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="space-y-8">
          <SectionHeader 
            title="Usage Guidelines" 
            subtitle="Best practices for implementing and extending the design system."
            eyebrow="Guidelines"
            align="left"
          />

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Typography Hierarchy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Use <strong className="text-foreground">IBM Plex Serif</strong> for all headings (h1-h6) to create distinction from body text.
                </p>
                <p className="text-sm text-muted-foreground">
                  Use <strong className="text-foreground">IBM Plex Sans</strong> for body text, UI elements, and buttons.
                </p>
                <p className="text-sm text-muted-foreground">
                  Use <strong className="text-foreground">IBM Plex Mono</strong> for code, technical content, and monospaced text.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Active States</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Use <strong className="text-mango">Mango (#D99A3D)</strong> for:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                  <li>Active link states</li>
                  <li>Hover effects on interactive elements</li>
                  <li>Focus rings on form inputs</li>
                  <li>Selected states and indicators</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Spacing Consistency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Always use spacing tokens (spacing-0 through spacing-24) rather than arbitrary values.
                </p>
                <p className="text-sm text-muted-foreground">
                  Maintain visual rhythm with regular spacing intervals. Group related elements with tighter spacing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Accessibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Ensure minimum contrast ratio of <strong className="text-foreground">4.5:1</strong> for normal text.
                </p>
                <p className="text-sm text-muted-foreground">
                  Ensure minimum contrast ratio of <strong className="text-foreground">3:1</strong> for large text (18px+).
                </p>
                <p className="text-sm text-muted-foreground">
                  Always provide focus states for keyboard navigation.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

function ColorSwatch({ name, variable, color, border = false, highlight = false }: { 
  name: string, 
  variable?: string, 
  color?: string, 
  border?: boolean,
  highlight?: boolean
}) {
  const bgStyle = variable ? { backgroundColor: variable } : { backgroundColor: color };
  
  return (
    <div className={`flex flex-col gap-2 ${highlight ? 'ring-2 ring-mango rounded-lg p-2' : ''}`}>
      <div 
        className={`h-24 rounded-lg w-full shadow-sm ${border ? 'border border-white/20' : ''}`}
        style={bgStyle}
      ></div>
      <div className="flex flex-col">
        <span className="font-medium text-sm">{name}</span>
        <code className="text-xs text-muted-foreground">{variable || color}</code>
      </div>
    </div>
  );
}
