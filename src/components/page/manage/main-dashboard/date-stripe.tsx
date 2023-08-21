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
      'flex group rounded-lg mx-1 cursor-pointer justify-center relative w-16',
      isHighlighted ? 
      'bg-orange-500 shadow-lg dark-shadow justify-center w-16' : 
      'hover:bg-orange-400 hover:shadow-lg hover-dark-shadow transition-all	duration-300',
      )
    }>
      {hasEvent && (
        <span className="flex h-3 w-3 absolute -top-1 -right-1">
          <span className="animate-ping absolute group-hover:opacity-75 opacity-0 inline-flex h-full w-full rounded-full bg-red-200 "></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
        </span>
      )}
      <div className='flex items-center p-2'>
        <div className='text-center'>
          <p className={clsx(
            'text-sm',
            isHighlighted ? 'text-gray-100' : 'text-gray-900 group-hover:text-gray-100 transition-all	duration-300',
          )}> {weekDay} </p>
          <p className={clsx(
            'mt-2',
            isHighlighted ? 'text-gray-100 font-bold' : 'text-gray-900 group-hover:text-gray-100 group-hover:font-bold transition-all	duration-300')}>{day}</p>
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