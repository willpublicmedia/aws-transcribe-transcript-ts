# AWS Transcribe Transcript (Typescript)

## Credits

This is a port of trhr/aws-transcribe-transcript (php) and purdy/aws-transcribe-transcript (python)

## Summary

This is a simple utility to convert the Amazon Transcribe output into a more readable format.

## Breaking Changes

- The original aws-transcribe-transcript projects are to be run as scripts, and expect file paths as formatting input. This project expects to be run as a library, so the format function expects json.
