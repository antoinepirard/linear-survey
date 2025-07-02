import Link from 'next/link';

interface ListItemData {
  title: string;
  description: string;
  category: string;
  slug?: string;
  href?: string;
}

interface ListItemProps {
  items: ListItemData[];
  title?: string;
  animationDelay?: string;
}

export default function ListItem({ items, title = 'Highlights', animationDelay = '400ms' }: ListItemProps) {
  console.log('ListItem received items:', items);
  
  return (
    <div className="animate-fade-in-up" style={{ animationDelay }}>
      <h2 className="text-base font-medium text-slate-900 mb-6">{title}</h2>
      <div className="space-y-2">
        {items.map((item, index) => {
          // Determine the link destination
          const linkHref = item.slug ? `/article/${item.slug}` : (item.href || "#");
          const isExternal = item.href && !item.slug;
          
          console.log(`Item ${index}:`, {
            title: item.title,
            slug: item.slug,
            href: item.href,
            linkHref,
            isExternal
          });
          
          return (
            <div key={index} className="group">
              {isExternal ? (
                <a 
                  href={item.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-3 border-b border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-slate-900 group-hover:text-slate-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase text-slate-500">
                        {item.category}
                      </span>
                      <span className="text-xs text-slate-400">↗</span>
                    </div>
                  </div>
                </a>
              ) : (
                <Link 
                  href={linkHref}
                  className="block py-3 border-b border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-slate-900 group-hover:text-slate-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase text-slate-500">
                        {item.category}
                      </span>
                      {item.slug && (
                        <span className="text-xs text-slate-400">→</span>
                      )}
                    </div>
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
