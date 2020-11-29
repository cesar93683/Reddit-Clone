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

export default function SortDropDown(props: SortDropDownProps) {
  const {
    className,
    disabled,
    sortByVotes,
    topActive,
    sortByNew,
    newActive,
  } = props;
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
}
