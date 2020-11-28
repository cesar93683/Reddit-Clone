import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

interface SortDropDownProps {
  className?: string;
  disabled?: boolean;
  sortByVotes: () => void;
  topActive: boolean;
  sortByNew: () => void;
  newActive: boolean;
}

const SortDropDown = ({
  className,
  disabled,
  sortByVotes,
  topActive,
  sortByNew,
  newActive,
}: SortDropDownProps) => {
  return (
    <DropdownButton className={className} disabled={disabled} title="Sort By">
      <Dropdown.Item onClick={sortByVotes} active={topActive}>
        Top
      </Dropdown.Item>
      <Dropdown.Item onClick={sortByNew} active={newActive}>
        New
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default SortDropDown;
