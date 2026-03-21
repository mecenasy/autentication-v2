import { Inject, Injectable } from '@nestjs/common';
import { EventBus, IEvent } from '@nestjs/cqrs';

@Injectable()
export class EventService {
  @Inject(EventBus)
  private readonly publisher: EventBus;

  public emit<T extends IEvent>(event: T) {
    this.publisher.publish(event);
  }
}
