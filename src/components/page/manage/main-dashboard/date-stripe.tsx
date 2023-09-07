import clsx from 'clsx';

function DateItem({ 
  date,
  isHighlighted,
  hasEvent,
}: { 
  date: Date, 
  isHighlighted: boolean,
  hasEvent: boolean,
}) {
  const weekDay = date.toLocaleString('default', { weekday: 'short' })
  const day = date.getDate()
  return (
    <div className={clsx(
      'flex group rounded-lg mx-1 cursor-pointer justify-center relative w-16 text-card-foreground',
      isHighlighted ? 
      'bg-primary shadow-lg dark-shadow justify-center w-16' : 
      'bg-muted hover:bg-primary/60 hover:shadow-lg hover-dark-shadow transition-all	duration-300',
      )
    }>
      {hasEvent && (
        <span className="flex h-3 w-3 absolute -top-1 -right-1">
          <span className="absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-red-200 "></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
        </span>
      )}
      <div className='flex items-center p-1'>
        <div className='text-center'>
          <p className={isHighlighted ? "text-primary-foreground" : "text-card-foreground"}>{weekDay}</p>
          <p className={isHighlighted ? "text-primary-foreground" : "text-card-foreground"}>{day}</p>
        </div>
      </div>
    </div>
  )
}

export default function DarkCalendarStripe({ 
  dates,
}: {
  dates: {
    date: Date,
    isHighlighted?: boolean,
    hasEvent?: boolean,
  }[],
}) {

  return (
    <div className='flex justify-start md:justify-center rounded-lg mx-auto py-4 px-2'>
      {dates.map((item, index) => (
        <DateItem key={index} date={item.date} isHighlighted={item.isHighlighted ?? false} hasEvent={item.hasEvent ?? false} />
      ))}
    </div>
  )
}