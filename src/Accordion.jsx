import { react } from 'react'
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

export default function Accordion({ title, isright, children }) {
  return (
    <div className={`w-full mx-auto rounded-2xl shadow p-5 m-5 ${isright?"bg-[linear-gradient(to_right,_rgba(0,128,0,.3)_0%,_white_20%)]":"bg-[linear-gradient(to_right,_rgba(255,0,0,.3)_0%,_white_20%)]"}`}>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between items-center rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none">
              <span>{title}</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 transition-transform duration-200`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
              {children}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
