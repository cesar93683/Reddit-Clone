import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

interface SortDropDownProps {
  sortByVotes: () => void;
  topActive: boolean;
  sortByNew: () => void;
  newActive: boolean;
}

const SortDropDown = ({
  sortByVotes,
  topActive,
  sortByNew,
  newActive,
}: SortDropDownProps) => {
  return (
    <DropdownButton title="Sort By">
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
