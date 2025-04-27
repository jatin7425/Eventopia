import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ImagesToggleBtn } from '../Theme/ToggleTheme';
import { ChevronRight } from 'lucide-react';

const AdminSideBar = ({ Collections }) => {
  const [collection, setCollection] = useState([]);
  const param = useParams();
  const currentPath = param.collection || null;

  useEffect(() => {
    setCollection(Collections || []);
  }, [Collections]);

  if (!collection.length) {
    return (
      <div className="h-full bg-white dark:bg-zinc-900 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 mb-2 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-zinc-900 flex flex-col justify-between p-4 border-r border-gray-100 dark:border-zinc-700">
      <div className="space-y-1">
        <h1 className="text-xl font-bold px-4 py-6 text-zinc-800 dark:text-zinc-100">
          Admin Console
        </h1>

        <div className="space-y-1">
          {collection.map((item) => (
            <Link
              to={`/@bw!n/${item}`}
              key={item}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                ${currentPath === item
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'}
              `}
            >
              <span className="capitalize">{item}</span>
              <ChevronRight size={16} className={`${currentPath === item ? 'text-primary-500' : 'text-zinc-400'}`} />
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-zinc-700 pt-4">
        <div className="px-4">
          <ImagesToggleBtn />
        </div>
      </div>
    </div>
  );
}

export default AdminSideBar;