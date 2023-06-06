import { Component, OnInit } from '@angular/core';
import { Actor } from '../models/actor.type';
import { ActorService } from '../services/actor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../models/movie.type';

@Component({
  selector: 'app-actor-details',
  templateUrl: './actor-details.component.html',
  styleUrls: ['./actor-details.component.css']
})
export class ActorDetailsComponent implements OnInit{
  
  actorId: number = 0;
  actor!: Actor;

  constructor(
    private actorService: ActorService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.actorId = +params['id'];
    });
    this.loadActorDetails();
  }
  
  loadActorDetails() {
    this.actorService.getActor(this.actorId).subscribe(
      (actor: Actor) => {
        this.actor = actor;
        console.log(this.actor);
  
        if (this.actor.biography === '') {
          this.actorService.getActorDetailsInEnglish(this.actorId).subscribe(
            (actorDetails: Actor) => {
              this.actor.biography = actorDetails.biography;
            }
          );
        }
  
        this.fetchMoviesToActor(); // Move the call here
      }
    );
  }
  

  fetchMoviesToActor() {
  this.actorService.getMoviesByActor(this.actorId).subscribe((response: any) => {
    if (response.cast) {
      this.actor.movies = response.cast.map((movie: any) => {
        return {
          title: movie.title,
          character: movie.character,
          poster_path: movie.poster_path
        };
      });
    }
  });
}

  
  

  goBack() {
    this.router.navigate(['/']); // Replace '/' with the appropriate route for going back
  }

  getImageURL(filePath: string) {
    const baseImageUrl = 'https://image.tmdb.org/t/p/';
    const imageSize = 'w500'; // You can adjust the size as per your requirements
    return baseImageUrl + imageSize + filePath;
  }

}


