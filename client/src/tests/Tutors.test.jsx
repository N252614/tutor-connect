import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Tutors from "../pages/Tutors"

// test suite for Tutors page
describe("Tutors page", () => {

    // check that the page heading is displayed
    it("should render tutor page heading when page loads", () => {

        // render Tutors component
        render(<Tutors />)

        // find heading text on the page
        const heading = screen.getByText(/find your tutor/i)

        // check that heading exists
        expect(heading).toBeInTheDocument()
    })
})