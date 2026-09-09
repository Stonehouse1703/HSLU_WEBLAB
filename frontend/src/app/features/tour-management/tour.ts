import {Tour} from './tour.types'

export const DUMMY_TOURS: Tour[] = [
  {
    id: '7f4d1c8e-2f1a-4c6d-9a12-8b4e5d7c1234',
    name: 'Zugerberg',
    date: '2023-01-01',
    time: '9:00',
    location: 'GIBZ',
    difficulty: 'easy',
    altitude: '2000m',
    tourManagerIds: ['7f4d1c8e-2f1a-4c6d-9a12-8b4e5d7c1234'],
    participantIds: ['1a2b3c4d-1111-4444-8888-123456789abc', '2b3c4d5e-2222-4444-8888-abcdef123456', '3c4d5e6f-3333-4444-8888-987654abcdef']
  },
  {
    id: '1a2b3c4d-1111-4444-8888-123456789abc',
    name: 'Pilatus',
    date: '2023-01-01',
    time: '10:00',
    location: 'KIBZ',
    difficulty: 'easy',
    altitude: '1000m',
    tourManagerIds: ['1a2b3c4d-1111-4444-8888-123456789abc'],
    participantIds: ['7f4d1c8e-2f1a-4c6d-9a12-8b4e5d7c1234', '2b3c4d5e-2222-4444-8888-abcdef123456', '4d5e6f70-5555-4444-8888-fedcba654321']
  }
]