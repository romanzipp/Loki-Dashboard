'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

function LabelDropdown({
    name, selectedValue, values, onSelect,
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    variant={selectedValue ? 'ghost-active' : 'ghost'}
                    role="combobox"
                    aria-expanded={open}
                    size="sm"
                    className="w-[200px] justify-between"
                >
                    {name}
                    {selectedValue && (
                        <span className="font-mono text-amber-400">
                            {selectedValue}
                        </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search value..." />
                    <CommandEmpty>No values found.</CommandEmpty>
                    <CommandGroup>
                        {values.map((value) => (
                            <CommandItem
                                key={value}
                                value={value}
                                onSelect={(currentValue) => {
                                    onSelect(name, currentValue);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedValue === value ? 'opacity-100' : 'opacity-0',
                                    )}
                                />
                                <span>
                                    {value}
                                </span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

LabelDropdown.propTypes = {
    name: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
    selectedValue: PropTypes.bool,
    onSelect: PropTypes.func,
};

export default LabelDropdown;
