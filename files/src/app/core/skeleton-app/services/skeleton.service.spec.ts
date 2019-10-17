import { TestBed } from '@angular/core/testing'

import { SkeletonService } from './skeleton.service'

describe('SkeletonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: SkeletonService = TestBed.get(SkeletonService)
    expect(service).toBeTruthy()
  })
})
