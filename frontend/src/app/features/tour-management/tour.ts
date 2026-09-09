import {Tour} from './tour.types'

export const DUMMY_TOURS: Tour[] = [
  {
    id: 1,
    name: 'Zugerberg',
    date: '2023-01-01',
    time: '9:00',
    location: 'GIBZ',
    difficulty: 'easy',
    altitude: '2000m',
    tour_manager: ['Colin'],
    participants: ['Hans', 'Peter', 'Max']
  },
  {
    id: 2,
    name: 'Pilatus',
    date: '2023-01-01',
    time: '10:00',
    location: 'KIBZ',
    difficulty: 'easy',
    altitude: '1000m',
    tour_manager: ['Colin'],
    participants: ['Hans', 'Peter', 'Max']
  }
]