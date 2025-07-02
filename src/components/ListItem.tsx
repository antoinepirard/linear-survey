interface ListItemData {
  title: string;
  description: string;
  category: string;
  href?: string;
}

interface ListItemProps {
  items: ListItemData[];
  title?: string;
  animationDelay?: string;
}

export default function ListItem({ items, title = 'Highlights', animationDelay = '400ms' }: ListItemProps) {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay }}>
      <h2 className="text-sm font-medium text-slate-900 mb-6">{title}</h2>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="group">
            <a 
              href={item.href || "#"} 
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
                <span className="text-xs uppercase text-slate-500 ml-4">
                  {item.category}
                </span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
