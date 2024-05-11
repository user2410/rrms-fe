import clsx from 'clsx';

export default function DarkCalendarStripe({ 
  dates,
  onClick,
}: {
  dates: {
    date: Date,
    isHighlighted?: boolean,
    hasEvent?: boolean,
  }[],
  onClick: (index: number) => void;
}) {

  return (
    <div className='flex justify-start md:justify-center rounded-lg mx-auto py-4 px-2'>
      {dates.map((item, index) => (
        <div 
          key={index} 
          className={clsx(
            'flex group rounded-lg mx-1 cursor-pointer justify-center relative w-16 text-card-foreground',
            item.isHighlighted ? 
            'bg-primary shadow-lg dark-shadow justify-center w-16' : 
            'bg-muted hover:bg-primary/60 hover:shadow-lg hover-dark-shadow transition-all	duration-300',
          )}
          onClick={() => onClick(index)}
        >
          {item.hasEvent && (
            <span className="flex h-3 w-3 absolute -top-1 -right-1">
              <span className="absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-red-200 "></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
          )}
          <div className='flex items-center p-1'>
            <div className='text-center'>
              <p className={item.isHighlighted ? "text-primary-foreground" : "text-card-foreground"}>{item.date.toLocaleString('vi-VN', { weekday: 'short' })}</p>
              <p className={item.isHighlighted ? "text-primary-foreground" : "text-card-foreground"}>{item.date.getDate()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
